import mongoose from 'mongoose'
import { IGymOwner } from './GymOwner.interface.js';

export interface ITeam extends mongoose.Document {
    _id: string;
    name: string;
    image: string;
    categoryId: string;
    gymOwnerId: IGymOwner['_id'];
    eventId: string;
    registerId: string;
}