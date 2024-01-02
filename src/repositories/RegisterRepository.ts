import { injectable } from 'inversify';
import Register from '../models/register.js';
import { IRegister, IRegisterQuery, IRegisterParams } from '../interfaces/IRegister.js';
import { ObjectId } from 'mongodb';

@injectable()
export class RegisterRepository {
    async register(registerParams: IRegisterParams) {
        const register = new Register(registerParams);
        return this.save(register);
    }

    async save(register: IRegister) {
        try {
            return await register.save();
        } catch (err) {
            throw new Error('Coudnt save!');
        }
    }

    async remove(register: IRegister) {
        try {
            return await register.remove();
        } catch (err) {
            throw new Error('Coudnt remove!');
        }
    }

    async getAllMatch(match: any, eventMatch: any, populate = '') {
            return await Register.aggregate([
                {
                    $match: match,
                },
                {
                    $lookup: {
                        from: 'events',
                        localField: 'eventId',
                        foreignField: '_id',
                        as: 'eventDetails',
                    },
                },
                {
                    $match: {
                        eventDetails: {
                            $elemMatch: eventMatch,
                        },
                    },
                },
                {
                    $addFields: {
                        event: { $arrayElemAt: ['$eventDetails', 0] },
                    },
                },
                {
                    $project: {
                        eventDetails: 0,
                    },
                },
            ]);
    }

    async getOne(options: any, populate = '') {
        return await Register.findOne(options).populate(populate, '-__v');
    }

    applyQuery(registerQuery: IRegisterQuery) {
        const eventMatch: any = {};
        const { name, categoryId } = registerQuery;
        if (name) {
            eventMatch['name'] = { $regex: new RegExp(name, 'i') };
        }
        if (categoryId && categoryId != '') {
            eventMatch['categoriesIds'] = new ObjectId(categoryId);
        }
        return eventMatch;
    }
}
