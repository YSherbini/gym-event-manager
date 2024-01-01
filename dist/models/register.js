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
const team_js_1 = __importDefault(require("./team.js"));
const registerSchema = new mongoose_1.default.Schema({
    eventId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    gymOwnerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'GymOwner',
        required: true
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
registerSchema.virtual('teams', {
    ref: 'Team',
    localField: '_id',
    foreignField: 'registerId'
});
registerSchema.virtual('event', {
    ref: 'Event',
    localField: 'eventId',
    foreignField: '_id',
    justOne: true
});
registerSchema.methods.toJSON = function () {
    const register = this;
    const registerObject = register.toObject();
    delete registerObject.__v;
    return registerObject;
};
registerSchema.post('remove', function (register, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield team_js_1.default.deleteMany({ registerId: register._id });
        next();
    });
});
const Register = mongoose_1.default.model('Register', registerSchema);
exports.default = Register;
//# sourceMappingURL=register.js.map