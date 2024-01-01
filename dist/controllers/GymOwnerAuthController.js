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
exports.GymOwnerAuthController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const GymOwnerRepository_js_1 = require("../repositories/GymOwnerRepository.js");
const validate_js_1 = require("../middleware/validate.js");
const inversify_1 = require("inversify");
const auth_js_1 = __importDefault(require("../middleware/auth.js"));
let GymOwnerAuthController = class GymOwnerAuthController {
    constructor(gymOwnerRepository) {
        this.gymOwnerRepository = gymOwnerRepository;
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const gymOwnerParams = req.body;
            try {
                const gymOwner = yield this.gymOwnerRepository.createUser(gymOwnerParams);
                const token = yield this.gymOwnerRepository.generateAuthToken(gymOwner);
                res.status(201).send({ token });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const gymOwnerParams = req.body;
            try {
                const gymOwner = yield this.gymOwnerRepository.findByCredentials(gymOwnerParams);
                const token = yield this.gymOwnerRepository.generateAuthToken(gymOwner);
                res.send({ token });
            }
            catch (err) {
                res.status(401).json({ error: err.message });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { gymOwner, token } = req;
            try {
                gymOwner.tokens = gymOwner.tokens.filter((t) => t.token !== token);
                yield this.gymOwnerRepository.save(gymOwner);
                res.send();
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
};
exports.GymOwnerAuthController = GymOwnerAuthController;
__decorate([
    (0, inversify_express_utils_1.httpPost)('/signup', validate_js_1.validateEmail, validate_js_1.validatePassword, validate_js_1.checkExistingEmail)
], GymOwnerAuthController.prototype, "signup", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/login', validate_js_1.validateEmail, validate_js_1.validatePassword)
], GymOwnerAuthController.prototype, "login", null);
__decorate([
    (0, inversify_express_utils_1.httpDelete)('/logout', auth_js_1.default)
], GymOwnerAuthController.prototype, "logout", null);
exports.GymOwnerAuthController = GymOwnerAuthController = __decorate([
    (0, inversify_express_utils_1.controller)('/gymOwners'),
    __param(0, (0, inversify_1.inject)(GymOwnerRepository_js_1.GymOwnerRepository))
], GymOwnerAuthController);
//# sourceMappingURL=GymOwnerAuthController.js.map