import mongoose from 'mongoose'

export interface ICategory extends mongoose.Document {
    _id: string;
    name: string;
}