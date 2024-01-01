var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import Register from '../models/register.js';
import { ObjectId } from 'mongodb';
let RegisterRepository = class RegisterRepository {
    async register(registerParams) {
        const register = new Register(registerParams);
        return this.save(register);
    }
    async save(register) {
        try {
            return await register.save();
        }
        catch (err) {
            throw new Error('Coudnt save!');
        }
    }
    async remove(register) {
        try {
            return await register.remove();
        }
        catch (err) {
            throw new Error('Coudnt save!');
        }
    }
    async alreadyExists(registerParams) {
        if (await this.getOne(registerParams)) {
            throw new Error('Already regestered!');
        }
    }
    async getAllMatch(match, eventMatch, populate = '') {
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
        }
        catch (err) {
            throw new Error('Coudnt get registers!');
        }
    }
    async getOne(options, populate = '') {
        try {
            return await Register.findOne(options).populate(populate, '-__v');
        }
        catch (err) {
            throw new Error('Coudnt get register');
        }
    }
    applyQuery(registerQuery) {
        const eventMatch = {};
        const { name, categoryId } = registerQuery;
        if (typeof name === 'string') {
            eventMatch['name'] = { $regex: new RegExp(name, 'i') };
        }
        if (typeof categoryId === 'string' && categoryId != '') {
            eventMatch['categoriesIds'] = new ObjectId(categoryId);
        }
        return eventMatch;
    }
};
RegisterRepository = __decorate([
    injectable()
], RegisterRepository);
export { RegisterRepository };
//# sourceMappingURL=RegisterRepository.js.map