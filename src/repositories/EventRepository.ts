import { injectable } from 'inversify';
import Event from '../models/event.js';
import { IQuery } from '../interfaces/IQuery.js';

@injectable()
export class EventRepository {
    async getAllMatch(match: any) {
        try {
            return await Event.find(match);
        } catch (err) {
            throw new Error('Coudnt get all events');
        }
    }

    async getById(_id: string, populate = '') {
        try {
            return await Event.findById({ _id }).populate(populate, '-__v');
        } catch (err) {
            throw new Error('Coudnt get event');
        }
    }

    applyQuery(eventQuery: IQuery) {
        const match: any = {}
        const { name, categoryId } = eventQuery
        if (typeof name === 'string') {
            match['name'] = {$regex: new RegExp(name, 'i')}
        }
        if (typeof categoryId === "string" && categoryId != "") {
            match['categoriesIds'] = { _id: categoryId }
        }
        return match
    }
}
