import { injectable } from 'inversify';
import Category from '../models/category';

@injectable()
export class CategoryRepository {
    async getAll() {
        return await Category.find();
    }

    async getById(_id: string) {
        return await Category.findById({ _id });
    }
}
