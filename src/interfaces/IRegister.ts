import mongoose from 'mongoose'
import { IEvent } from './IEvent';
import { ITeam } from './ITeam';
import { ICategory } from './ICategory';

export interface IRegister extends mongoose.Document {
    _id: string;
    eventId: string;
    event?: IEvent;
    gymOwnerId: string;
    teams?: ITeam[]
}

export interface IRegisterParams {
    eventId: string;
    gymOwnerId: string;

}

export interface IRegisterQuery {
    name?: string;
    categoryId?: ICategory['_id'];
};