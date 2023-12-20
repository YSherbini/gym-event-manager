import mongoose from "mongoose";
import Team from "./team.mjs";

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
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

registerSchema.virtual('teams', {
    ref: 'Team',
    localField: '_id',
    foreignField: 'registerId'
})

registerSchema.virtual('event', {
    ref: 'Event',
    localField: 'eventId',
    foreignField: '_id',
    justOne: true
})

registerSchema.pre('remove', async function (next) {
    const register = this
    await Team.deleteMany({ registerId: register._id })
    next()
})

const Register = mongoose.model('Register', registerSchema)

export default Register