import mongoose from 'mongoose';
import { IGymOwner } from './IGymOwner.js';
import { ICategory } from './ICategory.js';
import { IEvent } from './IEvent.js';
import { IRegister } from './IRegister.js';

export interface ITeam extends mongoose.Document {
    _id?: string;
    name: string;
    image?: string;
    categoryId: ICategory['_id'];
    gymOwnerId: IGymOwner['_id'];
    eventId: IEvent['_id'];
    registerId: IRegister['_id'];
    regester?: IRegister;
    event?: IEvent;
    category?: ICategory;
}

export interface ITeamParams {
    name: string;
    image?: string;
    categoryId: string;
    gymOwnerId: string;
    registerId: string;
    eventId: string;
}
