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
require("dotenv/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const team_js_1 = __importDefault(require("./team.js"));
const register_js_1 = __importDefault(require("./register.js"));
const gymOwnerSchema = new mongoose_1.default.Schema({
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
gymOwnerSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const gymOwner = this;
        if (gymOwner.isModified('password')) {
            gymOwner.password = yield bcrypt_1.default.hash(gymOwner.password, 8);
        }
        next();
    });
});
gymOwnerSchema.post('remove', function (gymOwner, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield team_js_1.default.deleteMany({ gymOwnerId: gymOwner._id });
        yield register_js_1.default.deleteMany({ gymOwnerId: gymOwner._id });
        next();
    });
});
const GymOwner = mongoose_1.default.model('GymOwner', gymOwnerSchema);
exports.default = GymOwner;
//# sourceMappingURL=gymOwner.js.map