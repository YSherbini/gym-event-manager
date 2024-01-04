"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.GymOwnerRepository = void 0;
const gymOwner_1 = __importDefault(require("../models/gymOwner"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const inversify_1 = require("inversify");
let GymOwnerRepository = class GymOwnerRepository {
    constructor() { }
    remove(gymOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield gymOwner.remove();
            }
            catch (err) {
                throw new Error('Coudnt remove!');
            }
        });
    }
    save(gymOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield gymOwner.save();
            }
            catch (err) {
                throw new Error('Coudnt save!');
            }
        });
    }
    update(gymOwner, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            Object.entries(updates).forEach(([field, fieldValue]) => {
                if (fieldValue !== undefined) {
                    gymOwner[field] = fieldValue;
                }
            });
            return this.save(gymOwner);
        });
    }
    changePassword(gymOwner, password) {
        return __awaiter(this, void 0, void 0, function* () {
            gymOwner.password = password;
            return this.save(gymOwner);
        });
    }
    createUser(gymOwnerParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const gymOwner = new gymOwner_1.default(gymOwnerParams);
            return this.save(gymOwner);
        });
    }
    getTeams(gymOwner, match, sort, skip, limit, populate = '') {
        return __awaiter(this, void 0, void 0, function* () {
            yield gymOwner
                .populate({
                path: populate,
                match,
                options: {
                    limit: parseInt(limit ? limit : ''),
                    skip: parseInt(skip ? skip : ''),
                    sort,
                },
            })
                .execPopulate();
        });
    }
    getOne(options, populate = '') {
        return __awaiter(this, void 0, void 0, function* () {
            return yield gymOwner_1.default.findOne(options).populate(populate, '-__v');
        });
    }
    findByCredentials({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gymOwner = yield gymOwner_1.default.findOne({ email });
                if (!gymOwner) {
                    throw new Error();
                }
                const isMatch = yield bcrypt_1.default.compare(password, gymOwner.password);
                if (!isMatch) {
                    throw new Error();
                }
                return gymOwner;
            }
            catch (err) {
                throw new Error('Invalid credentials!');
            }
        });
    }
    generateAuthToken(gymOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataStoredInToken = { _id: gymOwner._id.toString() };
            const token = jsonwebtoken_1.default.sign(dataStoredInToken, `${process.env.JWT_SECRET}`);
            gymOwner.tokens = gymOwner.tokens.concat({ token });
            yield gymOwner.save();
            return token;
        });
    }
};
exports.GymOwnerRepository = GymOwnerRepository;
exports.GymOwnerRepository = GymOwnerRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], GymOwnerRepository);
