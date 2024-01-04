import mongoose from 'mongoose';
import { ITeam } from './ITeam';

export interface IGymOwner extends mongoose.Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    image: string;
    tokens: { token: string }[];
    teams?: ITeam[];
}

export interface IGymOwnerAuthParams {
    name: string;
    email: string;
    password: string;
}

export interface IGymOwnerParams {
    name?: string;
    email?: string;
    image?: string;
}