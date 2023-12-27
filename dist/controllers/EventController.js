var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { controller, httpGet } from 'inversify-express-utils';
import { EventRepository } from '../repositories/EventRepository.js';
import { inject } from 'inversify';
import auth from '../middleware/auth.js';
import { isValidObjectId } from '../middleware/validate.js';
import { RegisterRepository } from '../repositories/RegisterRepository.js';
let EventController = class EventController {
    eventRepository;
    registerRepository;
    constructor(eventRepository, registerRepository) {
        this.eventRepository = eventRepository;
        this.registerRepository = registerRepository;
    }
    async allEvents(req, res) {
        const eventQuery = req.query;
        const match = this.eventRepository.applyQuery(eventQuery);
        try {
            const events = await this.eventRepository.getAllMatch(match);
            res.send(events);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async event(req, res) {
        const { id } = req.params;
        const gymOwnerId = req.gymOwner._id;
        try {
            const register = await this.registerRepository.getOne({ eventId: id, gymOwnerId }, 'teams');
            const event = await this.eventRepository.getById(id, 'categories');
            if (!event) {
                return res.status(404).send('Event not found!');
            }
            return res.send({ ...event.toObject(), registerId: register?._id, teams: register?.teams });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};
__decorate([
    httpGet('/', auth)
], EventController.prototype, "allEvents", null);
__decorate([
    httpGet('/:id', auth, isValidObjectId)
], EventController.prototype, "event", null);
EventController = __decorate([
    controller('/events'),
    __param(0, inject(EventRepository)),
    __param(1, inject(RegisterRepository))
], EventController);
export { EventController };
//# sourceMappingURL=EventController.js.map