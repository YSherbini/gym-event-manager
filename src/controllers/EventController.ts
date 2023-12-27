import express from 'express';
import { controller, httpGet } from 'inversify-express-utils';
import { EventRepository } from '../repositories/EventRepository.js';
import { inject } from 'inversify';
import { IRequest } from '../interfaces/IRequest.js';
import auth from '../middleware/auth.js';
import { isValidObjectId } from '../middleware/validate.js';
import { RegisterRepository } from '../repositories/RegisterRepository.js';
import { IQuery } from '../interfaces/IQuery.js';

@controller('/events')
export class EventController {
    constructor(
        @inject(EventRepository) private readonly eventRepository: EventRepository,
        @inject(RegisterRepository) private readonly registerRepository: RegisterRepository
        ) {}

    @httpGet('/', auth)
    async allEvents(req: IRequest, res: express.Response) {
        const eventQuery = req.query as IQuery;
        const match = this.eventRepository.applyQuery(eventQuery);
        try {
            const events = await this.eventRepository.getAllMatch(match);
            res.send(events);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    @httpGet('/:id', auth, isValidObjectId)
    async event(req: IRequest, res: express.Response) {
        const { id } = req.params;
        const gymOwnerId = req.gymOwner._id;
        try {
            const register = await this.registerRepository.getOne({ eventId: id, gymOwnerId }, 'teams');
            const event = await this.eventRepository.getById(id, 'categories');
            if (!event) {
                return res.status(404).send('Event not found!');
            }
            return res.send({ ...event.toObject(), registerId: register?._id, teams: register?.teams });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}
