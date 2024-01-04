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
exports.EventController = void 0;
const express_1 = __importDefault(require("express"));
const inversify_express_utils_1 = require("inversify-express-utils");
const EventRepository_1 = require("../repositories/EventRepository");
const inversify_1 = require("inversify");
const auth_1 = __importDefault(require("../middleware/auth"));
const validate_1 = require("../middleware/validate");
const RegisterRepository_1 = require("../repositories/RegisterRepository");
let EventController = class EventController {
    constructor(eventRepository, registerRepository) {
        this.eventRepository = eventRepository;
        this.registerRepository = registerRepository;
    }
    allEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventQuery = req.query;
            const match = this.eventRepository.applyQuery(eventQuery);
            const events = yield this.eventRepository.getAllMatch(match);
            res.send(events);
        });
    }
    event(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const gymOwnerId = req.gymOwner._id;
            const register = yield this.registerRepository.getOne({ eventId: id, gymOwnerId }, 'teams');
            const event = yield this.eventRepository.getById(id, 'categories');
            if (!event) {
                return res.status(404).send('Event not found!');
            }
            return res.send(Object.assign(Object.assign({}, event.toObject()), { registerId: register === null || register === void 0 ? void 0 : register._id, teams: register === null || register === void 0 ? void 0 : register.teams }));
        });
    }
};
exports.EventController = EventController;
__decorate([
    (0, inversify_express_utils_1.httpGet)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "allEvents", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/:id', validate_1.isValidObjectId),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "event", null);
exports.EventController = EventController = __decorate([
    (0, inversify_express_utils_1.controller)('/events', auth_1.default),
    __param(0, (0, inversify_1.inject)(EventRepository_1.EventRepository)),
    __param(1, (0, inversify_1.inject)(RegisterRepository_1.RegisterRepository)),
    __metadata("design:paramtypes", [EventRepository_1.EventRepository,
        RegisterRepository_1.RegisterRepository])
], EventController);
