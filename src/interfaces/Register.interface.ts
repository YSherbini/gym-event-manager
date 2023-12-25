import mongoose from 'mongoose'
import { IEvent } from './Event.interface.js';
import { ITeam } from './Team.interface.js';

export interface IRegister extends mongoose.Document {
    _id: string;
    eventId: string;
    event?: IEvent;
    gymOwnerId: string;
    teams?: ITeam[]
}