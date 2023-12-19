import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import Team from './team.mjs'
import register from './register.mjs'

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
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email format incorrect.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error('Password too easy.')
            }
        }
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


gymOwnerSchema.methods.toJSON = function() {
    const gymOwner = this
    const gymOwnerObject = gymOwner.toObject()
    delete gymOwnerObject.password
    delete gymOwnerObject.tokens
    return gymOwnerObject
}

gymOwnerSchema.statics.findByCredentials = async (email, password) => {
    const gymOwner = await GymOwner.findOne({ email })
    if (!gymOwner) {
        throw new error('Unable to login!')
    }
    const isMatch = await bcrypt.compare(password, gymOwner.password)
    if (!isMatch) {
        throw new error('Unable to login!')
    }
    return gymOwner
}

gymOwnerSchema.methods.generateAuthToken = async function () {
    const gymOwner = this
    const token = jwt.sign({ _id: gymOwner._id.toString() }, process.env.JWT_SECRET)
    gymOwner.tokens = gymOwner.tokens.concat({ token })
    await gymOwner.save()
    return token
}

gymOwnerSchema.virtual('teams', {
    ref: 'Team',
    localField: '_id',
    foreignField: 'gymOwnerId'
})

gymOwnerSchema.pre('save', async function (next) {
    const gymOwner = this
    if (gymOwner.isModified('password')) {
        gymOwner.password = await bcrypt.hash(gymOwner.password, 8)
    }
    next()
})

gymOwnerSchema.pre('delete', async function (next) {
    const gymOwner = this
    await Team.deleteMany({ gymOwnerId: gymOwner._id })
    await register.deleteMany({ gymOwnerId: gymOwner._id })
    next()
})

const GymOwner = mongoose.model('GymOwner', gymOwnerSchema)

export default GymOwner