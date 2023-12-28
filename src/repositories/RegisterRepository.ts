import { injectable } from 'inversify';
import Register from '../models/register.js';
import { IRegister, IRegisterParams } from '../interfaces/IRegister.js';
import { IQuery } from '../interfaces/IQuery.js';
import { ObjectId } from 'mongodb'

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
            throw new Error('Coudnt save!');
        }
    }

    async alreadyExists(registerParams: IRegisterParams) {
        if (await this.getOne(registerParams)) {
            throw new Error('Already regestered!');
        }
    }

    async getAllMatch(match: any, eventMatch: any, populate = '') {
        try {
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
        } catch (err) {
            throw new Error('Coudnt get registers!')
        }
    }

    async getOne(options: any, populate = '') {
        try {
            return await Register.findOne(options).populate(populate, '-__v');
        } catch (err) {
            throw new Error('Coudnt get register');
        }
    }

    applyQuery(registerQuery: IQuery) {
        const eventMatch: any = {};
        const { name, categoryId } = registerQuery;
        if (typeof name === 'string') {
            eventMatch['name'] = { $regex: new RegExp(name, 'i') };
        }
        if (typeof categoryId === 'string' && categoryId != '') {
            eventMatch['categoriesIds'] = new ObjectId(categoryId);
        }
        return eventMatch;
    }
}
