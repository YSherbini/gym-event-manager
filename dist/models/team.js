"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const teamSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    categoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    image: {
        type: String,
        default: ""
    },
    gymOwnerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'GymOwner',
        required: true
    },
    registerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Register',
        required: true
    },
    eventId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
teamSchema.methods.toJSON = function () {
    const team = this;
    const teamObject = team.toObject();
    delete teamObject.__v;
    return teamObject;
};
const Team = mongoose_1.default.model('Team', teamSchema);
exports.default = Team;
//# sourceMappingURL=team.js.map