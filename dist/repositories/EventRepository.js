var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import Event from '../models/event.js';
let EventRepository = class EventRepository {
    async getAllMatch(match) {
        try {
            return await Event.find(match);
        }
        catch (err) {
            throw new Error('Coudnt get all events');
        }
    }
    async getById(_id, populate = '') {
        try {
            return await Event.findById({ _id }).populate(populate, '-__v');
        }
        catch (err) {
            throw new Error('Coudnt get event');
        }
    }
    applyQuery(eventQuery) {
        const match = {};
        const { name, categoryId } = eventQuery;
        if (typeof name === 'string') {
            match['name'] = { $regex: new RegExp(name, 'i') };
        }
        if (typeof categoryId === "string" && categoryId != "") {
            match['categoriesIds'] = { _id: categoryId };
        }
        return match;
    }
};
EventRepository = __decorate([
    injectable()
], EventRepository);
export { EventRepository };
//# sourceMappingURL=EventRepository.js.map