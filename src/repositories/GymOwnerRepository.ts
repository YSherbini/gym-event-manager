import { IGymOwner, IGymOwnerAuthParams, IGymOwnerParams } from '../interfaces/IGymOwner.js';
import { DataStoredInToken } from '../interfaces/jwt.js';
import GymOwner from '../models/gymOwner.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { injectable } from 'inversify';

@injectable()
export class GymOwnerRepository {
    constructor() {}

    async remove(gymOwner: IGymOwner) {
        try {
            return await gymOwner.remove();
        } catch (err) {
            throw new Error('Coudnt remove!');
        }
    }

    async save(gymOwner: IGymOwner) {
        try {
            return await gymOwner.save();
        } catch (err) {
            throw new Error('Coudnt save!');
        }
    }

    async update(gymOwner: IGymOwner, updates: IGymOwnerParams) {
        Object.entries(updates).forEach(([field, fieldValue]) => {
            if (fieldValue !== undefined) {
                (gymOwner as any)[field] = fieldValue;
            }
        });

        return this.save(gymOwner);
    }

    async changePassword(gymOwner: IGymOwner, password: string) {
        gymOwner.password = password;

        return this.save(gymOwner);
    }

    async createUser(gymOwnerParams: IGymOwnerAuthParams) {
        const gymOwner = new GymOwner(gymOwnerParams);

        return this.save(gymOwner);
    }

    async getTeams(gymOwner: IGymOwner, match: any, sort: Record<string, number>, skip?: string, limit?: string, populate = '') {
        await gymOwner
            .populate({
                path: populate,
                match,
                options: {
                    limit: parseInt(limit ? limit : ''),
                    skip: parseInt(skip ? skip : ''),
                    sort,
                },
            })
            .execPopulate();
    }

    async getOne(options: any, populate = '') {
        return await GymOwner.findOne(options).populate(populate, '-__v');
    }

    async findByCredentials({ email, password }: IGymOwnerAuthParams) {
        try {
            const gymOwner = await GymOwner.findOne({ email });

            if (!gymOwner) {
                throw new Error();
            }

            const isMatch = await bcrypt.compare(password, gymOwner.password);

            if (!isMatch) {
                throw new Error();
            }

            return gymOwner;
        } catch (err) {
            throw new Error('Invalid credentials!');
        }
    }

    async generateAuthToken(gymOwner: IGymOwner) {
        const dataStoredInToken: DataStoredInToken = { _id: gymOwner._id.toString() };
        const token = jwt.sign(dataStoredInToken, `${process.env.JWT_SECRET}`);

        gymOwner.tokens = gymOwner.tokens.concat({ token });
        await gymOwner.save();

        return token;
    }
}
