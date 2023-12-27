import mongoose from "mongoose";
import { ICategory } from "../interfaces/ICategory.js";


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
})

categorySchema.methods.toJSON = function() {
    const category = this as ICategory
    const categoryObject: any = category.toObject()
    delete categoryObject.__v
    return categoryObject
}

const Category = mongoose.model<ICategory>('Category', categorySchema)

export default Category