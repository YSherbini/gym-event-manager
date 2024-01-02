import express from 'express';
import { controller, httpGet } from 'inversify-express-utils';
import { CategoryRepository } from '../repositories/CategoryRepository.js';
import { inject } from 'inversify';
import { IRequest } from '../interfaces/IRequest.js';
import auth from '../middleware/auth.js';
import { isValidObjectId } from '../middleware/validate.js';

@controller('/categories')
export class CategoryController {
    constructor(@inject(CategoryRepository) private readonly categoryRepository: CategoryRepository) {}

    @httpGet('/', auth)
    async allCategories(req: IRequest, res: express.Response) {
        const categories = await this.categoryRepository.getAll();

        res.send(categories);
    }

    @httpGet('/:id', auth, isValidObjectId)
    async category(req: IRequest, res: express.Response) {
        const { id } = req.params;

        const category = await this.categoryRepository.getById(id);

        if (!category) {
            return res.status(404).send('Category not found!');
        }
        
        res.send(category);
    }
}
