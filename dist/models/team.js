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
    },
    registerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
teamSchema.virtual('category', {
    ref: 'Category',
    localField: 'categoryId',
    foreignField: '_id',
    justOne: true
});
teamSchema.virtual('register', {
    ref: 'Register',
    localField: 'registerId',
    foreignField: '_id',
    justOne: true
});
teamSchema.virtual('event', {
    ref: 'Event',
    localField: 'eventId',
    foreignField: '_id',
    justOne: true
});
const Team = mongoose.model('Team', teamSchema);
export default Team;
//# sourceMappingURL=team.js.map