import mongoose from 'mongoose';
import Register from './register.js';
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
eventSchema.methods.toJSON = function () {
    const event = this;
    const eventObject = event.toObject();
    delete eventObject.__v;
    return eventObject;
};
eventSchema.virtual('categories', {
    ref: 'Category',
    localField: 'categoriesIds',
    foreignField: '_id'
});
eventSchema.virtual('teams', {
    ref: 'Team',
    localField: '_id',
    foreignField: 'eventId'
});
eventSchema.post('remove', async function (event, next) {
    await Register.deleteMany({ eventId: event._id });
    next();
});
const Event = mongoose.model('Event', eventSchema);
export default Event;
//# sourceMappingURL=event.js.map