import mongoose from "mongoose";
import Team from "./team.js";
import { IRegister } from "../interfaces/IRegister.js";

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

registerSchema.methods.toJSON = function() {
    const register = this as IRegister
    const registerObject: any = register.toObject()
    delete registerObject.__v
    return registerObject
}

registerSchema.post('remove', async function (register, next) {
    await Team.deleteMany({ registerId: register._id })
    next()
})

const Register = mongoose.model<IRegister>('Register', registerSchema)

export default Register