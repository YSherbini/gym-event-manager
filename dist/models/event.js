"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const register_1 = __importDefault(require("./register"));
const eventSchema = new mongoose_1.default.Schema({
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
            type: mongoose_1.default.Schema.Types.ObjectId,
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
eventSchema.post('remove', function (event, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield register_1.default.deleteMany({ eventId: event._id });
        next();
    });
});
const Event = mongoose_1.default.model('Event', eventSchema);
exports.default = Event;
