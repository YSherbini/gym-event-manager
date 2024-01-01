var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { controller, httpDelete, httpGet, httpPatch, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import auth from '../middleware/auth.js';
import { isValidObjectId } from '../middleware/validate.js';
import { TeamRepository } from '../repositories/TeamRepository.js';
import { RegisterRepository } from '../repositories/RegisterRepository.js';
import { GymOwnerRepository } from '../repositories/GymOwnerRepository.js';
import { EventRepository } from '../repositories/EventRepository.js';
let TeamController = class TeamController {
    teamRepository;
    registerRepository;
    eventRepository;
    gymOwnerRepository;
    constructor(teamRepository, registerRepository, eventRepository, gymOwnerRepository) {
        this.teamRepository = teamRepository;
        this.registerRepository = registerRepository;
        this.eventRepository = eventRepository;
        this.gymOwnerRepository = gymOwnerRepository;
    }
    async addTeam(req, res) {
        const { name, categoryId, registerId } = req.body;
        const gymOwnerId = req.gymOwner._id;
        try {
            const register = await this.registerRepository.getOne({ _id: registerId, gymOwnerId }, 'event teams');
            if (!register) {
                return res.status(404).send('Register not found!');
            }
            if (register.event && !register.event.categoriesIds.includes(categoryId)) {
                return res.status(400).send('Categories doesnt match!');
            }
            let team = await this.teamRepository.create({ name, categoryId, registerId, gymOwnerId, eventId: register.eventId });
            team = await this.teamRepository.save(team);
            res.status(201).send(team);
        }
        catch (err) {
            res.status(400).send({ error: err.message });
        }
    }
    async duplicateTeams(req, res) {
        const { teamsIds, registerId } = req.body;
        const gymOwnerId = req.gymOwner._id;
        try {
            const register = await this.registerRepository.getOne({ _id: registerId, gymOwnerId }, 'event teams');
            if (teamsIds.length === 0) {
                return res.status(400).send("No teams provided.");
            }
            if (!register) {
                return res.status(404).send('Register not found!');
            }
            const { teams, error } = await this.teamRepository.duplicateTeams(teamsIds, register);
            if (error) {
                const { status, msg } = error;
                return res.status(status).send(msg);
            }
            await this.teamRepository.saveAll(teams);
            res.status(201).send(teams);
        }
        catch (err) {
            res.status(400).send({ error: err.message });
        }
    }
    async myTeams(req, res) {
        const teamQuery = req.query;
        const { gymOwner } = req;
        let categoriesIds = [];
        if (teamQuery.eventId) {
            const event = await this.eventRepository.getById(teamQuery.eventId);
            if (event) {
                categoriesIds = event.categoriesIds;
            }
        }
        const { match, sort } = this.teamRepository.applyQuery(teamQuery, categoriesIds);
        const { skip, limit } = teamQuery;
        try {
            await this.gymOwnerRepository.getTeams(gymOwner, match, sort, skip, limit, 'teams');
            res.send(gymOwner.teams);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async team(req, res) {
        const { id } = req.params;
        try {
            const team = await this.teamRepository.getOne({ _id: id }, 'category event');
            if (!team) {
                return res.status(404).send('Team not found!');
            }
            res.send(team);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async editTeam(req, res) {
        const { id } = req.params;
        const updates = req.body;
        const gymOwnerId = req.gymOwner._id;
        try {
            let team = await this.teamRepository.getOne({ _id: id, gymOwnerId }, 'event');
            if (!team) {
                return res.status(404).send('Team not found!');
            }
            if (updates.categoryId && team.event && !team.event.categoriesIds.includes(updates.categoryId)) {
                return res.status(400).send('Categories doesnt match!');
            }
            team = await this.teamRepository.update(team, updates);
            res.send(team);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async deleteTeam(req, res) {
        const { id } = req.params;
        const gymOwnerId = req.gymOwner._id;
        try {
            const team = await this.teamRepository.getOne({ _id: id, gymOwnerId });
            if (!team) {
                return res.status(404).send('Team not found!');
            }
            await this.teamRepository.remove(team);
            res.send();
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};
__decorate([
    httpPost('/', auth)
], TeamController.prototype, "addTeam", null);
__decorate([
    httpPost('/duplicate', auth)
], TeamController.prototype, "duplicateTeams", null);
__decorate([
    httpGet('/', auth)
], TeamController.prototype, "myTeams", null);
__decorate([
    httpGet('/:id', auth, isValidObjectId)
], TeamController.prototype, "team", null);
__decorate([
    httpPatch('/:id', auth, isValidObjectId)
], TeamController.prototype, "editTeam", null);
__decorate([
    httpDelete('/:id', auth, isValidObjectId)
], TeamController.prototype, "deleteTeam", null);
TeamController = __decorate([
    controller('/teams'),
    __param(0, inject(TeamRepository)),
    __param(1, inject(RegisterRepository)),
    __param(2, inject(EventRepository)),
    __param(3, inject(GymOwnerRepository))
], TeamController);
export { TeamController };
//# sourceMappingURL=TeamController.js.map