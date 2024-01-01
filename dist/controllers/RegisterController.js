"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.RegisterController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const auth_js_1 = __importDefault(require("../middleware/auth.js"));
const validate_js_1 = require("../middleware/validate.js");
const RegisterRepository_js_1 = require("../repositories/RegisterRepository.js");
let RegisterController = class RegisterController {
    constructor(registerRepository) {
        this.registerRepository = registerRepository;
    }
    createRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { eventId } = req.body;
            const registerParams = { gymOwnerId: req.gymOwner._id, eventId };
            try {
                yield this.registerRepository.alreadyExists(registerParams);
                const register = yield this.registerRepository.register(registerParams);
                yield register.populate('event', '-__v').execPopulate();
                res.status(201).send(register);
            }
            catch (err) {
                res.status(400).send({ error: err.message });
            }
        });
    }
    allRegisters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const registerQuery = req.query;
            const gymOwnerId = req.gymOwner._id;
            try {
                const eventMatch = this.registerRepository.applyQuery(registerQuery);
                const registers = yield this.registerRepository.getAllMatch({ gymOwnerId }, eventMatch);
                res.send(registers);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const gymOwnerId = req.gymOwner._id;
            try {
                const register = yield this.registerRepository.getOne({ _id: id, gymOwnerId }, 'teams event');
                if (!register) {
                    return res.status(404).send('Register not found!');
                }
                res.send(register);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    unregister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const gymOwnerId = req.gymOwner._id;
            try {
                const register = yield this.registerRepository.getOne({ _id: id, gymOwnerId });
                if (!register) {
                    return res.status(404).send('Register not found!');
                }
                yield this.registerRepository.remove(register);
                res.send();
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
};
exports.RegisterController = RegisterController;
__decorate([
    (0, inversify_express_utils_1.httpPost)('/', auth_js_1.default)
], RegisterController.prototype, "createRegister", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/', auth_js_1.default)
], RegisterController.prototype, "allRegisters", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/:id', auth_js_1.default, validate_js_1.isValidObjectId)
], RegisterController.prototype, "register", null);
__decorate([
    (0, inversify_express_utils_1.httpDelete)('/:id', auth_js_1.default, validate_js_1.isValidObjectId)
], RegisterController.prototype, "unregister", null);
exports.RegisterController = RegisterController = __decorate([
    (0, inversify_express_utils_1.controller)('/registers'),
    __param(0, (0, inversify_1.inject)(RegisterRepository_js_1.RegisterRepository))
], RegisterController);
//# sourceMappingURL=RegisterController.js.map