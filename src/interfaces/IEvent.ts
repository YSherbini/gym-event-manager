import mongoose from 'mongoose'
import { ICategory } from './ICategory';

export interface IEvent extends mongoose.Document {
    _id: string;
    name: string;
    description: string,
    date: Date,
    image: string
    categoriesIds: string[]
}

export interface IEventQuery {
    name?: string;
    categoryId?: ICategory['_id'];
};