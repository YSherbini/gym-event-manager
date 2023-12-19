import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    image: {
        type: String,
        default: ""
    },
    gymOwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GymOwner',
        required: true
    }
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

teamSchema.virtual('category', {
    ref: 'Category',
    localField: 'categoryId',
    foreignField: '_id'
})

const Team = mongoose.model('Team', teamSchema)

export default Team