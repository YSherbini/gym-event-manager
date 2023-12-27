import mongoose from 'mongoose'
import { IEvent } from './IEvent.js';
import { ITeam } from './ITeam.js';

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