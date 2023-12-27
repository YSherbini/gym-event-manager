import { injectable } from 'inversify';
import Team from '../models/team.js';
import { ITeam, ITeamParams } from '../interfaces/ITeam.js';
import { IQuery } from '../interfaces/IQuery.js';

@injectable()
export class TeamRepository {
    async create(teamParams: ITeamParams) {
        const team = new Team(teamParams);
        return this.save(team);
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
