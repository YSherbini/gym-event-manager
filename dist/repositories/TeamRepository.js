var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import Team from '../models/team.js';
let TeamRepository = class TeamRepository {
    async create(teamParams) {
        const team = new Team(teamParams);
        return this.save(team);
    }
    async update(team, updates) {
        Object.entries(updates).forEach(([field, fieldValue]) => {
            if (fieldValue !== undefined) {
                team[field] = fieldValue;
            }
        });
        return this.save(team);
    }
    async save(team) {
        try {
            return await team.save();
        }
        catch (err) {
            throw new Error('Coudnt save!');
        }
    }
    async remove(team) {
        try {
            return await team.remove();
        }
        catch (err) {
            throw new Error('Coudnt save!');
        }
    }
    async getOne(options, populate = '') {
        try {
            return await Team.findOne(options).populate(populate, '-__v');
        }
        catch (err) {
            throw new Error('Coudnt get team');
        }
    }
    applyQuery({ categoryId, sortBy }) {
        const match = {};
        const sort = {};
        if (categoryId) {
            match.categoryId = categoryId;
        }
        if (sortBy) {
            const [sortee, order] = sortBy.split(':');
            sort[sortee] = order === 'desc' ? -1 : 1;
        }
        return { match, sort };
    }
};
TeamRepository = __decorate([
    injectable()
], TeamRepository);
export { TeamRepository };
//# sourceMappingURL=TeamRepository.js.map