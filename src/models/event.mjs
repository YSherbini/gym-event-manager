import mongoose from 'mongoose'
import register from './register.mjs'

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    categoriesIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
    }],
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

eventSchema.virtual('registers', {
    ref: 'register',
    localField: '_id',
    foreignField: 'eventId'
})

eventSchema.virtual('categories', {
    ref: 'Category',
    localField: 'categoriesIds',
    foreignField: '_id'
})

eventSchema.pre('delete', async function (next) {
    const event = this
    await register.deleteMany({ eventId: event._id })
    next()
})

const Event = mongoose.model('Event', eventSchema)

export default Event