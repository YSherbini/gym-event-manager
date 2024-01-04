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
exports.EventRepository = void 0;
const inversify_1 = require("inversify");
const event_1 = __importDefault(require("../models/event"));
let EventRepository = class EventRepository {
    getAllMatch(match) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield event_1.default.find(match);
        });
    }
    getById(_id, populate = '') {
        return __awaiter(this, void 0, void 0, function* () {
            return yield event_1.default.findById({ _id }).populate(populate, '-__v');
        });
    }
    applyQuery(eventQuery) {
        const match = {};
        const { name, categoryId } = eventQuery;
        if (name) {
            match['name'] = { $regex: new RegExp(name, 'i') };
        }
        if (categoryId && categoryId != '') {
            match['categoriesIds'] = categoryId;
        }
        return match;
    }
};
exports.EventRepository = EventRepository;
exports.EventRepository = EventRepository = __decorate([
    (0, inversify_1.injectable)()
], EventRepository);
