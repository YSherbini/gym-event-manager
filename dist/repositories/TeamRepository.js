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
        for (const team of teams) {
            await this.save(team);
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
    async duplicateTeams(teamsIds, register) {
        const dupTeams = { teams: [] };
        try {
            for (const teamId of teamsIds) {
                const team = await this.getOne({ _id: teamId });
                if (!team) {
                    dupTeams.error = { status: 404, msg: "Team not found!" };
                    return dupTeams;
                }
                if (register.event && !register.event.categoriesIds.includes(team.categoryId)) {
                    dupTeams.error = { status: 422, msg: "Categories does't match" };
                    return dupTeams;
                }
                const { name, image, categoryId, gymOwnerId, registerId, eventId } = team;
                const teamParams = { name, image, categoryId, gymOwnerId, registerId, eventId };
                const dupTeam = await this.create(teamParams);
                dupTeams.teams.push(dupTeam);
            }
            await this.saveAll(dupTeams.teams);
            return dupTeams;
        }
        catch (err) {
            throw new Error();
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