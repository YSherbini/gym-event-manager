import express from 'express';
import jwt from 'jsonwebtoken';
import GymOwner from '../models/gymOwner.js';
import { DataStoredInToken } from '../interfaces/jwt.js';
import { IRequest } from '../interfaces/IRequest.js';

const auth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as DataStoredInToken;
            const gymOwner = await GymOwner.findOne({ _id: decoded._id, 'tokens.token': token });

            if (!gymOwner) {
                throw new Error();
            }

            (req as IRequest).gymOwner = gymOwner;
            (req as IRequest).token = token;
        }

        next();
    } catch (err) {
        res.status(401).send({ error: 'Please authenticate' });
    }
};

export default auth;
