import mongoose from 'mongoose'
import { IGymOwner } from './GymOwner.interface.js';
import { ICategory } from './Category.interface.js';
import { IEvent } from './Event.interface.js';
import { IRegister } from './Register.interface.js';

export interface ITeam extends mongoose.Document {
    _id: string;
    name: string;
    image: string;
    categoryId: ICategory['_id'];
    gymOwnerId: IGymOwner['_id'];
    eventId: IEvent['_id'];
    registerId: IRegister['_id'];
    regester?: IRegister
    event?: IEvent
    category?: ICategory
}