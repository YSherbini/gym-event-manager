import mongoose from 'mongoose'

export interface IEvent extends mongoose.Document {
    _id: string;
    name: string;
    description: string,
    date: Date,
    image: string
    categoriesIds: string[]
}
