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
exports.GymOwnerController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const GymOwnerRepository_js_1 = require("../repositories/GymOwnerRepository.js");
const inversify_1 = require("inversify");
const auth_js_1 = __importDefault(require("../middleware/auth.js"));
const validate_js_1 = require("../middleware/validate.js");
let GymOwnerController = class GymOwnerController {
    constructor(gymOwnerRepository) {
        this.gymOwnerRepository = gymOwnerRepository;
    }
    profile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.send(req.gymOwner);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    EditProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updates = req.body;
            let { gymOwner } = req;
            try {
                gymOwner = yield this.gymOwnerRepository.update(gymOwner, updates);
                res.send(gymOwner);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password } = req.body;
            let { gymOwner } = req;
            try {
                gymOwner = yield this.gymOwnerRepository.changePassword(gymOwner, password);
                res.send();
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    deleteProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { gymOwner } = req;
            try {
                gymOwner = yield this.gymOwnerRepository.remove(gymOwner);
                res.send();
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
};
exports.GymOwnerController = GymOwnerController;
__decorate([
    (0, inversify_express_utils_1.httpGet)('/', auth_js_1.default)
], GymOwnerController.prototype, "profile", null);
__decorate([
    (0, inversify_express_utils_1.httpPatch)('/', auth_js_1.default, validate_js_1.validateEmailForUpdate, validate_js_1.checkExistingEmailForUpdate)
], GymOwnerController.prototype, "EditProfile", null);
__decorate([
    (0, inversify_express_utils_1.httpPatch)('/changePassword', auth_js_1.default, validate_js_1.validatePassword)
], GymOwnerController.prototype, "changePassword", null);
__decorate([
    (0, inversify_express_utils_1.httpDelete)('/', auth_js_1.default)
], GymOwnerController.prototype, "deleteProfile", null);
exports.GymOwnerController = GymOwnerController = __decorate([
    (0, inversify_express_utils_1.controller)('/gymOwners/profile'),
    __param(0, (0, inversify_1.inject)(GymOwnerRepository_js_1.GymOwnerRepository))
], GymOwnerController);
//# sourceMappingURL=GymOwnerController.js.map