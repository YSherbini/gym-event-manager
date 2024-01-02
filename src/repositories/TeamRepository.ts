import { injectable } from 'inversify';
import Team from '../models/team.js';
import { IDuplicateRes, ITeam, ITeamParams } from '../interfaces/ITeam.js';
import { ITeamQuery } from '../interfaces/ITeam.js';
import { IRegister } from 'interfaces/IRegister.js';

enum SortOrder {
    asc = 1,
    desc = -1,
}

@injectable()
export class TeamRepository {
    create(teamParams: ITeamParams) {
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
        await Promise.all(teams.map((team) => this.save(team)));
    }

    async remove(team: ITeam) {
        try {
            return await team.remove();
        } catch (err) {
            throw new Error('Coudnt save!');
        }
    }

    async getOne(options: any, populate = '') {
        return await Team.findOne(options).populate(populate, '-__v');
    }

    async duplicateTeams(teamsIds: ITeam[], register: IRegister) {
        const dupTeams = { teams: [] as ITeam[] } as IDuplicateRes;

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

            const dupTeam = this.create({ ...team.toObject(), id: undefined, _id: undefined } as ITeam);
            dupTeams.teams.push(dupTeam);
        }

        try {
            await this.saveAll(dupTeams.teams);

            return dupTeams;
        } catch (err) {
            throw new Error();
        }
    }

    applyQuery({ categoryId, sortBy }: ITeamQuery, categoriesIds: string[]) {
        let match: any = { $and: [] as any[] };
        const sort: Record<string, number> = {};

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
}
