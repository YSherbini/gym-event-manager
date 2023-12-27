var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import Category from '../models/category.js';
let CategoryRepository = class CategoryRepository {
    async getAll() {
        try {
            return await Category.find();
        }
        catch (err) {
            throw new Error('Coudnt get all categories');
        }
    }
    async getById(_id) {
        try {
            return await Category.findById({ _id });
        }
        catch (err) {
            throw new Error('Coudnt get category');
        }
    }
};
CategoryRepository = __decorate([
    injectable()
], CategoryRepository);
export { CategoryRepository };
//# sourceMappingURL=CategoryRepository.js.map