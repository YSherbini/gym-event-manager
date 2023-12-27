var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import GymOwner from '../models/gymOwner.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { injectable } from 'inversify';
let GymOwnerRepository = class GymOwnerRepository {
    constructor() { }
    async remove(gymOwner) {
        try {
            return await gymOwner.remove();
        }
        catch (err) {
            throw new Error('Coudnt remove!');
        }
    }
    async save(gymOwner) {
        try {
            return await gymOwner.save();
        }
        catch (err) {
            throw new Error('Coudnt save!');
        }
    }
    async createUser(gymOwnerParams) {
        const gymOwner = new GymOwner(gymOwnerParams);
        return this.save(gymOwner);
    }
    async getTeams(gymOwner, match, sort, skip, limit, populate = '') {
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
    async findByCredentials({ email, password }) {
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
        }
        catch (err) {
            throw new Error('Invalid credentials!');
        }
    }
    async generateAuthToken(gymOwner) {
        try {
            const dataStoredInToken = { _id: gymOwner._id.toString() };
            const token = jwt.sign(dataStoredInToken, `${process.env.JWT_SECRET}`);
            gymOwner.tokens = gymOwner.tokens.concat({ token });
            await gymOwner.save();
            return token;
        }
        catch (err) {
            throw new Error('Unable to login!');
        }
    }
};
GymOwnerRepository = __decorate([
    injectable()
], GymOwnerRepository);
export { GymOwnerRepository };
//# sourceMappingURL=GymOwnerRepository.js.map