import { injectable } from 'inversify';
import Category from '../models/category.js';

@injectable()
export class CategoryRepository {
    async getAll() {
        try {
            return await Category.find();
        } catch (err) {
            throw new Error('Coudnt get all categories');
        }
    }

    async getById(_id: string) {
        try {
            return await Category.findById({ _id });
        } catch (err) {
            throw new Error('Coudnt get category');
        }
    }
}
