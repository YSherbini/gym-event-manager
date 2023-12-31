import express from 'express';
import { controller, httpDelete, httpGet, httpPatch, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { IRequest } from '../interfaces/IRequest.js';
import auth from '../middleware/auth.js';
import { isValidObjectId } from '../middleware/validate.js';
import { TeamRepository } from '../repositories/TeamRepository.js';
import { ITeam, IDuplicateParams, ITeamParams } from '../interfaces/ITeam.js';
import { IQuery } from '../interfaces/IQuery.js';
import { RegisterRepository } from '../repositories/RegisterRepository.js';
import { GymOwnerRepository } from '../repositories/GymOwnerRepository.js';
import { EventRepository } from '../repositories/EventRepository.js';

@controller('/teams')
export class TeamController {
    constructor(
        @inject(TeamRepository) private readonly teamRepository: TeamRepository,
        @inject(RegisterRepository) private readonly registerRepository: RegisterRepository,
        @inject(EventRepository) private readonly  eventRepository: EventRepository,
        @inject(GymOwnerRepository) private readonly  gymOwnerRepository: GymOwnerRepository
        ) {}

    @httpPost('/', auth)
    async addTeam(req: IRequest, res: express.Response) {
        const { name, categoryId, registerId } = req.body as ITeamParams;
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
            team = await this.teamRepository.save(team)
            res.status(201).send(team);
        } catch (err: any) {
            res.status(400).send({ error: err.message });
        }
    }

    @httpPost('/duplicate', auth)
    async duplicateTeams(req: IRequest, res: express.Response) {
        const { teamsIds, registerId } = req.body as IDuplicateParams;
        const gymOwnerId = req.gymOwner._id;
        try {
            const register = await this.registerRepository.getOne({ _id: registerId, gymOwnerId }, 'event teams');
            if (teamsIds.length === 0) {
                return res.status(400).send("No teams provided.")
            }
            if (!register) {
                return res.status(404).send('Register not found!');
            }
            const dupTeams = await this.teamRepository.duplicateTeams(teamsIds, register)
            if (dupTeams.error) {
                const { status, msg } = dupTeams.error
                return res.status(status).send(msg)
            }
            await this.teamRepository.saveAll(dupTeams.teams)
            res.status(201).send(dupTeams.teams);
        } catch (err: any) {
            res.status(400).send({ error: err.message });
        }
    }

    @httpGet('/', auth)
    async myTeams(req: IRequest, res: express.Response) {
        const teamQuery = req.query as IQuery;
        const { gymOwner } = req;
        let categoriesIds: string[] = []
        if (teamQuery.eventId) {
            const event = await this.eventRepository.getById(teamQuery.eventId)
            if (event) {
                categoriesIds = event.categoriesIds
            }
            
        }
        const { match, sort } = this.teamRepository.applyQuery(teamQuery, categoriesIds);
        const { skip, limit } = teamQuery
        try {
            await this.gymOwnerRepository.getTeams(gymOwner, match, sort, skip, limit, 'teams')
        res.send(gymOwner.teams);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    @httpGet('/:id', auth, isValidObjectId)
    async team(req: IRequest, res: express.Response) {
        const { id } = req.params;
        try {
            const team = await this.teamRepository.getOne({ _id: id }, 'category event');
            if (!team) {
                return res.status(404).send('Team not found!');
            }
            res.send(team);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    @httpPatch('/:id', auth, isValidObjectId)
    async editTeam(req: IRequest, res: express.Response) {
        const { id } = req.params;
        const updates = req.body as ITeamParams;
        const gymOwnerId = req.gymOwner._id;
        try {
            let team = await this.teamRepository.getOne({ _id: id, gymOwnerId }, 'event')
            if (!team) {
                return res.status(404).send('Team not found!');
            }
            if (updates.categoryId && team.event && !team.event.categoriesIds.includes(updates.categoryId)) {
                return res.status(400).send('Categories doesnt match!');
            }
            team = await this.teamRepository.update(team, updates)
            res.send(team)
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    @httpDelete('/:id', auth, isValidObjectId)
    async deleteTeam(req: IRequest, res: express.Response) {
        const { id } = req.params;
        const gymOwnerId = req.gymOwner._id;
        try {
            const team = await this.teamRepository.getOne({ _id: id, gymOwnerId });
            if (!team) {
                return res.status(404).send('Team not found!');
            }
            await this.teamRepository.remove(team);
            res.send();
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

}
