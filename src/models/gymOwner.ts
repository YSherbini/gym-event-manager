import mongoose from 'mongoose'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import Team from './team'
import Register from './register'
import { IGymOwner } from '../interfaces/IGymOwner'

const gymOwnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
    },
    image: {
        type: String,
        default: ""
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

gymOwnerSchema.virtual('teams', {
    ref: 'Team',
    localField: '_id',
    foreignField: 'gymOwnerId'
})

gymOwnerSchema.methods.toJSON = function() {
    const gymOwner = this as IGymOwner
    const gymOwnerObject: any = gymOwner.toObject()
    delete gymOwnerObject.password
    delete gymOwnerObject.tokens
    delete gymOwnerObject.__v
    return gymOwnerObject
}

gymOwnerSchema.pre('save', async function (this: IGymOwner, next) {
    const gymOwner = this
    if (gymOwner.isModified('password')) {
        gymOwner.password = await bcrypt.hash(gymOwner.password, 8)
    }
    next()
})

gymOwnerSchema.post<IGymOwner>('remove', async function (gymOwner: IGymOwner, next) {
    await Team.deleteMany({ gymOwnerId: gymOwner._id })
    await Register.deleteMany({ gymOwnerId: gymOwner._id })
    next()
})
const GymOwner = mongoose.model<IGymOwner>('GymOwner', gymOwnerSchema)

export default GymOwner