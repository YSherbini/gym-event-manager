import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    gymOwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GymOwner',
        required: true
    },
    teamsIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
        }
    ],
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

registerSchema.virtual('teams', {
    ref: 'Team',
    localField: 'teamsIds',
    foreignField: '_id'
})

registerSchema.virtual('event', {
    ref: 'Event',
    localField: 'eventId',
    foreignField: '_id',
    justOne: true
})

const register = mongoose.model('register', registerSchema)

export default register