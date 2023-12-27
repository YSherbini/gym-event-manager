var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import Register from '../models/register.js';
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
    async getAllMatch(match, populate = '') {
        try {
            return await Register.find(match).populate(populate, '-__v');
        }
        catch (err) {
            throw new Error('Coudnt get all registers');
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
    applyQuery(registers, { name, categoryId }) {
        return registers.filter((register) => {
            const event = register.event;
            if (name || categoryId) {
                return event && (name && event.name.toLowerCase().includes(name?.toLowerCase()) || categoryId && event.categoriesIds.includes(categoryId));
            }
            else
                return true;
        });
    }
};
RegisterRepository = __decorate([
    injectable()
], RegisterRepository);
export { RegisterRepository };
//# sourceMappingURL=RegisterRepository.js.map