var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import Team from '../models/team.js';
var SortOrder;
(function (SortOrder) {
    SortOrder[SortOrder["asc"] = 1] = "asc";
    SortOrder[SortOrder["desc"] = -1] = "desc";
})(SortOrder || (SortOrder = {}));
let TeamRepository = class TeamRepository {
    create(teamParams) {
        return new Team(teamParams);
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
    async saveAll(teams) {
        await Promise.all(teams.map((team) => this.save(team)));
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
        return await Team.findOne(options).populate(populate, '-__v');
    }
    async duplicateTeams(teamsIds, register) {
        const dupTeams = { teams: [] };
        for (const teamId of teamsIds) {
            const team = await this.getOne({ _id: teamId });
            if (!team) {
                dupTeams.error = { status: 404, msg: 'Team not found!' };
                return dupTeams;
            }
            if (register.event && !register.event.categoriesIds.includes(team.categoryId)) {
                dupTeams.error = { status: 422, msg: "Categories does't match" };
                return dupTeams;
            }
            const dupTeam = this.create({ ...team.toObject(), id: undefined, _id: undefined });
            dupTeams.teams.push(dupTeam);
        }
        try {
            await this.saveAll(dupTeams.teams);
            return dupTeams;
        }
        catch (err) {
            throw new Error();
        }
    }
    applyQuery({ categoryId, sortBy }, categoriesIds) {
        let match = { $and: [] };
        const sort = {};
        if (categoryId) {
            match.$and.push({ categoryId });
        }
        if (categoriesIds.length > 0) {
            match.$and.push({ categoryId: { $in: categoriesIds } });
        }
        if (match.$and.length === 0) {
            match = {};
        }
        if (sortBy) {
            const [sortee, order] = sortBy.split(':');
            sort[sortee] = order === 'desc' ? SortOrder.desc : SortOrder.asc;
        }
        return { match, sort };
    }
};
TeamRepository = __decorate([
    injectable()
], TeamRepository);
export { TeamRepository };
//# sourceMappingURL=TeamRepository.js.map