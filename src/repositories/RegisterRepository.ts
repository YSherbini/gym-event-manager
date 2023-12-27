import { injectable } from 'inversify';
import Register from '../models/register.js';
import { IRegister, IRegisterParams } from '../interfaces/IRegister.js';
import { IQuery } from '../interfaces/IQuery.js';

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

    async getAllMatch(match: any, populate = '') {
        try {
            return await Register.find(match).populate(populate, '-__v');
        } catch (err) {
            throw new Error('Coudnt get all registers');
        }
    }

    async getOne(options: any, populate = '') {
        try {
            return await Register.findOne(options).populate(populate, '-__v');
        } catch (err) {
            throw new Error('Coudnt get register');
        }
    }

    applyQuery(registers: IRegister[], { name, categoryId }: IQuery) {
        return registers.filter((register: IRegister) => {
            const event = register.event;
            if (name || categoryId) {
                return event && (name && event.name.toLowerCase().includes(name?.toLowerCase()) || categoryId && event.categoriesIds.includes(categoryId));
            } else return true;
        });
    }

}
