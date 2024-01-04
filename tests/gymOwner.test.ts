import 'reflect-metadata';
import request from 'supertest';
import express from 'express';

import '../dist/config/index';
import GymOwner from '../src/models/gymOwner';
import { gymOwnerOneId, gymOwnerOne, setupDatabase } from './db/db'
import { App } from '../src/app';

let app: express.Application;

beforeAll(async () => {
    app = await new App().setup();
});

beforeEach(setupDatabase);

test('Should signup a new user', async () => {
    const response = await request(app)
        .post('/gymOwners/signup')
        .send({
            name: 'Yahya',
            email: 'yahya@gmail.com',
            password: 'Password',
        })
        .expect(201);
    expect(response.body.token).not.toBeNull();
});

test('Should login existing user', async () => {
    const response = await request(app)
        .post('/gymOwners/login')
        .send({
            email: gymOwnerOne.email,
            password: gymOwnerOne.password,
        })
        .expect(200);
    const gymOwner = await GymOwner.findById(gymOwnerOneId)
    expect(response.body.token).not.toBeNull();
    expect(response.body.token).toBe(gymOwner?.tokens[1].token)
});

test('Should not login existing user', async () => {
    await request(app)
        .post('/gymOwners/login')
        .send({
            email: 'yahya@gmail.com',
            password: 'pPssword',
        })
        .expect(401);
});

test('Should get profile for user', async () => {
    await request(app).get('/gymOwners/profile').set('Authorization', `Bearer ${gymOwnerOne.tokens[0].token}`).send().expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app).get('/gymOwners/profile').send().expect(401);
});

test('Should delete account for user', async () => {
    await request(app).delete('/gymOwners/profile').set('Authorization', `Bearer ${gymOwnerOne.tokens[0].token}`).send().expect(200);
    const gymOwner = await GymOwner.findById(gymOwnerOneId)
    expect(gymOwner).toBeNull()
});

test('Should not delete account for unauthenticated user', async () => {
    await request(app).delete('/gymOwners/profile').send().expect(401);
});

test('Should update valid user fields', async () => {
    const response = await request(app)
        .patch('/gymOwners/profile')
        .set('Authorization', `Bearer ${gymOwnerOne.tokens[0].token}`)
        .send({
            name: "moh"
        })
        .expect(200);
    const gymOwner = await GymOwner.findById(gymOwnerOneId)
    expect(gymOwner?.name).toEqual('moh')
});

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/gymOwners/profile')
        .set('Authorization', `Bearer ${gymOwnerOne.tokens[0].token}`)
        .send({
            name: ""
        })
        .expect(422);
});