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
exports.isValidObjectId = exports.checkExistingEmailForUpdate = exports.validateEmailForUpdate = exports.checkExistingEmail = exports.validatePassword = exports.validateEmail = void 0;
const gymOwner_js_1 = __importDefault(require("../models/gymOwner.js"));
const validateEmail = (req, res, next) => {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(422).json({ error: 'Invalid email format' });
    }
    next();
};
exports.validateEmail = validateEmail;
const validatePassword = (req, res, next) => {
    const { password } = req.body;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
        return res.status(422).json({ error: 'Invalid password format' });
    }
    next();
};
exports.validatePassword = validatePassword;
const checkExistingEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const existingUser = yield gymOwner_js_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        next();
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.checkExistingEmail = checkExistingEmail;
const validateEmailForUpdate = (req, res, next) => {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email == "" || email && !emailRegex.test(email)) {
        return res.status(422).json({ error: 'Invalid email format' });
    }
    next();
};
exports.validateEmailForUpdate = validateEmailForUpdate;
const checkExistingEmailForUpdate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const id = req.gymOwner._id;
        const existingUser = yield gymOwner_js_1.default.findOne({ email, _id: { $ne: id } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        next();
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.checkExistingEmailForUpdate = checkExistingEmailForUpdate;
const isValidObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(422).json({ error: 'Invalid ObjectId' });
        ;
    }
    next();
};
exports.isValidObjectId = isValidObjectId;
//# sourceMappingURL=validate.js.map