import { injectable } from 'inversify';
import Team from '../models/team.js';
import { IDuplicateRes, ITeam, ITeamParams } from '../interfaces/ITeam.js';
import { IQuery } from '../interfaces/IQuery.js';
import { IRegister } from 'interfaces/IRegister.js';

@injectable()
export class TeamRepository {
    async create(teamParams: ITeamParams) {
        return new Team(teamParams);
    }

    async update(team: ITeam, updates: ITeamParams) {
        Object.entries(updates).forEach(([field, fieldValue]) => {
            if (fieldValue !== undefined) {
                (team as any)[field] = fieldValue;
            }
        });
        return this.save(team);
    }

    async save(team: ITeam) {
        try {
            return await team.save();
        } catch (err) {
            throw new Error('Coudnt save!');
        }
    }

    async saveAll(teams: ITeam[]) {
        for (const team of teams) {
            await this.save(team)
        }
    }

    async remove(team: ITeam) {
        try {
            return await team.remove();
        } catch (err) {
            throw new Error('Coudnt save!');
        }
    }

    async getOne(options: any, populate = '') {
        try {
            return await Team.findOne(options).populate(populate, '-__v');
        } catch (err) {
            throw new Error('Coudnt get team');
        }
    }

    async duplicateTeams(teamsIds: ITeam[], register: IRegister) {
        const dupTeams = {teams: [] as ITeam[]} as IDuplicateRes
        try {
            for (const teamId of teamsIds) {
                const team = await this.getOne({ _id: teamId })
                if (!team) {
                    dupTeams.error = {status: 404, msg: "Team not found!"}
                    return dupTeams
                }
                if (register.event && !register.event.categoriesIds.includes(team.categoryId)) {
                    dupTeams.error = {status: 422, msg: "Categories does't match"}
                    return dupTeams
                }
                const { name, image, categoryId, gymOwnerId, registerId, eventId } = team
                const teamParams: ITeamParams = { name, image, categoryId, gymOwnerId, registerId, eventId }
                const dupTeam = await this.create(teamParams)
                dupTeams.teams.push(dupTeam)
            }
            await this.saveAll(dupTeams.teams)
            return dupTeams
        } catch (err) {
            throw new Error()
        }
        
    }

    applyQuery({ categoryId, sortBy }: IQuery) {
        const match: { categoryId?: string } = {};
        const sort: Record<string, number> = {};
        if (categoryId) {
            match.categoryId = categoryId;
        }
        if (sortBy) {
            const [sortee, order] = sortBy.split(':');
            sort[sortee] = order === 'desc' ? -1 : 1;
        }
        return { match, sort };
    }
}
