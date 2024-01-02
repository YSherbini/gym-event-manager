import { injectable } from 'inversify';
import Event from '../models/event.js';
import { IQuery } from '../interfaces/IQuery.js';

@injectable()
export class EventRepository {
    async getAllMatch(match: any) {
        return await Event.find(match);
    }

    async getById(_id: string, populate = '') {
        return await Event.findById({ _id }).populate(populate, '-__v');
    }

    applyQuery(eventQuery: IQuery) {
        const match: any = {};
        const { name, categoryId } = eventQuery;
        if (typeof name === 'string') {
            match['name'] = { $regex: new RegExp(name, 'i') };
        }
        if (typeof categoryId === 'string' && categoryId != '') {
            match['categoriesIds'] = categoryId;
        }
        return match;
    }
}
