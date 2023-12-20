import mongoose from 'mongoose'
import Register from './register.mjs'

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
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

eventSchema.virtual('categories', {
    ref: 'Category',
    localField: 'categoriesIds',
    foreignField: '_id'
})

eventSchema.virtual('teams', {
    ref: 'Team',
    localField: '_id',
    foreignField: 'eventId'
})

eventSchema.pre('delete', async function (next) {
    const event = this
    await Register.deleteMany({ eventId: event._id })
    next()
})

const Event = mongoose.model('Event', eventSchema)

export default Event