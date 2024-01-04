import express from 'express';
import { controller, httpGet } from 'inversify-express-utils';
import { EventRepository } from '../repositories/EventRepository';
import { inject } from 'inversify';
import { IRequest } from '../interfaces/IRequest';
import auth from '../middleware/auth';
import { isValidObjectId } from '../middleware/validate';
import { RegisterRepository } from '../repositories/RegisterRepository';
import { IEventQuery } from '../interfaces/IEvent';

@controller('/events', auth)
export class EventController {
    constructor(
        @inject(EventRepository) private readonly eventRepository: EventRepository,
        @inject(RegisterRepository) private readonly registerRepository: RegisterRepository
    ) {}

    @httpGet('/')
    async allEvents(req: IRequest, res: express.Response) {
        const eventQuery = req.query as IEventQuery;

        const match = this.eventRepository.applyQuery(eventQuery);
        const events = await this.eventRepository.getAllMatch(match);

        res.send(events);
    }

    @httpGet('/:id', isValidObjectId)
    async event(req: IRequest, res: express.Response) {
        const { id } = req.params;
        const gymOwnerId = req.gymOwner._id;

        const register = await this.registerRepository.getOne({ eventId: id, gymOwnerId }, 'teams');
        const event = await this.eventRepository.getById(id, 'categories');

        if (!event) {
            return res.status(404).send('Event not found!');
        }

        return res.send({ ...event.toObject(), registerId: register?._id, teams: register?.teams });
    }
}
