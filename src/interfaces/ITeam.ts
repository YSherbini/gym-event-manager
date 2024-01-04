import mongoose from 'mongoose';
import { IGymOwner } from './IGymOwner';
import { ICategory } from './ICategory';
import { IEvent } from './IEvent';
import { IRegister } from './IRegister';

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
    categoryId: ICategory['id'];
    gymOwnerId: IGymOwner['id'];
    registerId: IRegister['id'];
    eventId: IEvent['id'];
}

export interface IDuplicateParams {
    teamsIds: ITeam['id'][];
    registerId: IRegister['id'];
    eventId: IEvent['id'];
}

export interface IDuplicateRes {
    teams: ITeam[];
    error: { status: number; msg: string };
}

export interface ITeamQuery {
    categoryId?: ICategory['_id'];
    eventId?: IEvent['_id']
    sortBy?: string;
    limit?: string;
    skip?: string;
};