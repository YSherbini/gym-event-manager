import { injectable } from 'inversify';
import Event from '../models/event.js';
import { IEventQuery } from '../interfaces/IEvent.js';

@injectable()
export class EventRepository {
    async getAllMatch(match: any) {
        return await Event.find(match);
    }

    async getById(_id: string, populate = '') {
        return await Event.findById({ _id }).populate(populate, '-__v');
    }

    applyQuery(eventQuery: IEventQuery) {
        const match: any = {};
        const { name, categoryId } = eventQuery;
        if (name) {
            match['name'] = { $regex: new RegExp(name, 'i') };
        }
        if (categoryId && categoryId != '') {
            match['categoriesIds'] = categoryId;
        }
        return match;
    }
}
