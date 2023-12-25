import mongoose from 'mongoose'
import { ITeam } from './Team.interface.js';

export interface IGymOwner extends mongoose.Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    image: string;
    tokens: { token: string }[];
    teams?: ITeam[]
}
