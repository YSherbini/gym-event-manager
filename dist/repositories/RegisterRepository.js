"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.RegisterRepository = void 0;
const inversify_1 = require("inversify");
const register_js_1 = __importDefault(require("../models/register.js"));
const mongodb_1 = require("mongodb");
let RegisterRepository = class RegisterRepository {
    register(registerParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const register = new register_js_1.default(registerParams);
            return this.save(register);
        });
    }
    save(register) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield register.save();
            }
            catch (err) {
                throw new Error('Coudnt save!');
            }
        });
    }
    remove(register) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield register.remove();
            }
            catch (err) {
                throw new Error('Coudnt save!');
            }
        });
    }
    alreadyExists(registerParams) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.getOne(registerParams)) {
                throw new Error('Already regestered!');
            }
        });
    }
    getAllMatch(match, eventMatch, populate = '') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield register_js_1.default.aggregate([
                    {
                        $match: match,
                    },
                    {
                        $lookup: {
                            from: 'events',
                            localField: 'eventId',
                            foreignField: '_id',
                            as: 'eventDetails',
                        },
                    },
                    {
                        $match: {
                            eventDetails: {
                                $elemMatch: eventMatch,
                            },
                        },
                    },
                    {
                        $addFields: {
                            event: { $arrayElemAt: ['$eventDetails', 0] },
                        },
                    },
                    {
                        $project: {
                            eventDetails: 0,
                        },
                    },
                ]);
            }
            catch (err) {
                throw new Error('Coudnt get registers!');
            }
        });
    }
    getOne(options, populate = '') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield register_js_1.default.findOne(options).populate(populate, '-__v');
            }
            catch (err) {
                throw new Error('Coudnt get register');
            }
        });
    }
    applyQuery(registerQuery) {
        const eventMatch = {};
        const { name, categoryId } = registerQuery;
        if (typeof name === 'string') {
            eventMatch['name'] = { $regex: new RegExp(name, 'i') };
        }
        if (typeof categoryId === 'string' && categoryId != '') {
            eventMatch['categoriesIds'] = new mongodb_1.ObjectId(categoryId);
        }
        return eventMatch;
    }
};
exports.RegisterRepository = RegisterRepository;
exports.RegisterRepository = RegisterRepository = __decorate([
    (0, inversify_1.injectable)()
], RegisterRepository);
//# sourceMappingURL=RegisterRepository.js.map