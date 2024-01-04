import express from 'express';
import { controller, httpGet } from 'inversify-express-utils';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { inject } from 'inversify';
import { IRequest } from '../interfaces/IRequest';
import auth from '../middleware/auth';
import { isValidObjectId } from '../middleware/validate';

@controller('/categories', auth)
export class CategoryController {
    constructor(@inject(CategoryRepository) private readonly categoryRepository: CategoryRepository) {}

    @httpGet('/')
    async allCategories(req: IRequest, res: express.Response) {
        const categories = await this.categoryRepository.getAll();

        res.send(categories);
    }

    @httpGet('/:id', isValidObjectId)
    async category(req: IRequest, res: express.Response) {
        const { id } = req.params;

        const category = await this.categoryRepository.getById(id);

        if (!category) {
            return res.status(404).send('Category not found!');
        }
        
        res.send(category);
    }
}
