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
Object.defineProperty(exports, "__esModule", { value: true });
exports.alreadyRegistered = void 0;
const index_1 = require("../container/index");
const RegisterRepository_1 = require("../repositories/RegisterRepository");
const alreadyRegistered = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const registerRepository = index_1.container.get(RegisterRepository_1.RegisterRepository);
    const { eventId } = req.body;
    if (yield registerRepository.getOne({ gymOwnerId: req.gymOwner._id, eventId })) {
        return res.status(409).json({ error: 'Already Registered!' });
    }
    next();
});
exports.alreadyRegistered = alreadyRegistered;
