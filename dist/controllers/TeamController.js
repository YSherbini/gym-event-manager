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
exports.TeamController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const auth_js_1 = __importDefault(require("../middleware/auth.js"));
const validate_js_1 = require("../middleware/validate.js");
const TeamRepository_js_1 = require("../repositories/TeamRepository.js");
const RegisterRepository_js_1 = require("../repositories/RegisterRepository.js");
const GymOwnerRepository_js_1 = require("../repositories/GymOwnerRepository.js");
const EventRepository_js_1 = require("../repositories/EventRepository.js");
let TeamController = class TeamController {
    constructor(teamRepository, registerRepository, eventRepository, gymOwnerRepository) {
        this.teamRepository = teamRepository;
        this.registerRepository = registerRepository;
        this.eventRepository = eventRepository;
        this.gymOwnerRepository = gymOwnerRepository;
    }
    addTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, categoryId, registerId } = req.body;
            const gymOwnerId = req.gymOwner._id;
            try {
                const register = yield this.registerRepository.getOne({ _id: registerId, gymOwnerId }, 'event teams');
                if (!register) {
                    return res.status(404).send('Register not found!');
                }
                if (register.event && !register.event.categoriesIds.includes(categoryId)) {
                    return res.status(400).send('Categories doesnt match!');
                }
                let team = yield this.teamRepository.create({ name, categoryId, registerId, gymOwnerId, eventId: register.eventId });
                team = yield this.teamRepository.save(team);
                res.status(201).send(team);
            }
            catch (err) {
                res.status(400).send({ error: err.message });
            }
        });
    }
    duplicateTeams(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { teamsIds, registerId } = req.body;
            const gymOwnerId = req.gymOwner._id;
            try {
                const register = yield this.registerRepository.getOne({ _id: registerId, gymOwnerId }, 'event teams');
                if (teamsIds.length === 0) {
                    return res.status(400).send("No teams provided.");
                }
                if (!register) {
                    return res.status(404).send('Register not found!');
                }
                const { teams, error } = yield this.teamRepository.duplicateTeams(teamsIds, register);
                if (error) {
                    const { status, msg } = error;
                    return res.status(status).send(msg);
                }
                yield this.teamRepository.saveAll(teams);
                res.status(201).send(teams);
            }
            catch (err) {
                res.status(400).send({ error: err.message });
            }
        });
    }
    myTeams(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamQuery = req.query;
            const { gymOwner } = req;
            let categoriesIds = [];
            if (teamQuery.eventId) {
                const event = yield this.eventRepository.getById(teamQuery.eventId);
                if (event) {
                    categoriesIds = event.categoriesIds;
                }
            }
            const { match, sort } = this.teamRepository.applyQuery(teamQuery, categoriesIds);
            const { skip, limit } = teamQuery;
            try {
                yield this.gymOwnerRepository.getTeams(gymOwner, match, sort, skip, limit, 'teams');
                res.send(gymOwner.teams);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    team(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const team = yield this.teamRepository.getOne({ _id: id }, 'category event');
                if (!team) {
                    return res.status(404).send('Team not found!');
                }
                res.send(team);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    editTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const updates = req.body;
            const gymOwnerId = req.gymOwner._id;
            try {
                let team = yield this.teamRepository.getOne({ _id: id, gymOwnerId }, 'event');
                if (!team) {
                    return res.status(404).send('Team not found!');
                }
                if (updates.categoryId && team.event && !team.event.categoriesIds.includes(updates.categoryId)) {
                    return res.status(400).send('Categories doesnt match!');
                }
                team = yield this.teamRepository.update(team, updates);
                res.send(team);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    deleteTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const gymOwnerId = req.gymOwner._id;
            try {
                const team = yield this.teamRepository.getOne({ _id: id, gymOwnerId });
                if (!team) {
                    return res.status(404).send('Team not found!');
                }
                yield this.teamRepository.remove(team);
                res.send();
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
};
exports.TeamController = TeamController;
__decorate([
    (0, inversify_express_utils_1.httpPost)('/', auth_js_1.default)
], TeamController.prototype, "addTeam", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/duplicate', auth_js_1.default)
], TeamController.prototype, "duplicateTeams", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/', auth_js_1.default)
], TeamController.prototype, "myTeams", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/:id', auth_js_1.default, validate_js_1.isValidObjectId)
], TeamController.prototype, "team", null);
__decorate([
    (0, inversify_express_utils_1.httpPatch)('/:id', auth_js_1.default, validate_js_1.isValidObjectId)
], TeamController.prototype, "editTeam", null);
__decorate([
    (0, inversify_express_utils_1.httpDelete)('/:id', auth_js_1.default, validate_js_1.isValidObjectId)
], TeamController.prototype, "deleteTeam", null);
exports.TeamController = TeamController = __decorate([
    (0, inversify_express_utils_1.controller)('/teams'),
    __param(0, (0, inversify_1.inject)(TeamRepository_js_1.TeamRepository)),
    __param(1, (0, inversify_1.inject)(RegisterRepository_js_1.RegisterRepository)),
    __param(2, (0, inversify_1.inject)(EventRepository_js_1.EventRepository)),
    __param(3, (0, inversify_1.inject)(GymOwnerRepository_js_1.GymOwnerRepository))
], TeamController);
//# sourceMappingURL=TeamController.js.map