import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import Team from './team.js';
import Register from './register.js';
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
});
gymOwnerSchema.virtual('teams', {
    ref: 'Team',
    localField: '_id',
    foreignField: 'gymOwnerId'
});
gymOwnerSchema.methods.toJSON = function () {
    const gymOwner = this;
    const gymOwnerObject = gymOwner.toObject();
    delete gymOwnerObject.password;
    delete gymOwnerObject.tokens;
    delete gymOwnerObject.__v;
    return gymOwnerObject;
};
gymOwnerSchema.pre('save', async function (next) {
    const gymOwner = this;
    if (gymOwner.isModified('password')) {
        gymOwner.password = await bcrypt.hash(gymOwner.password, 8);
    }
    next();
});
gymOwnerSchema.post('remove', async function (gymOwner, next) {
    await Team.deleteMany({ gymOwnerId: gymOwner._id });
    await Register.deleteMany({ gymOwnerId: gymOwner._id });
    next();
});
const GymOwner = mongoose.model('GymOwner', gymOwnerSchema);
export default GymOwner;
//# sourceMappingURL=gymOwner.js.map