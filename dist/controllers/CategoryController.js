var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { controller, httpGet } from 'inversify-express-utils';
import { CategoryRepository } from '../repositories/CategoryRepository.js';
import { inject } from 'inversify';
import auth from '../middleware/auth.js';
import { isValidObjectId } from '../middleware/validate.js';
let CategoryController = class CategoryController {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async allCategories(req, res) {
        const categories = await this.categoryRepository.getAll();
        res.send(categories);
    }
    async category(req, res) {
        const { id } = req.params;
        const category = await this.categoryRepository.getById(id);
        if (!category) {
            return res.status(404).send('Category not found!');
        }
        res.send(category);
    }
};
__decorate([
    httpGet('/', auth)
], CategoryController.prototype, "allCategories", null);
__decorate([
    httpGet('/:id', auth, isValidObjectId)
], CategoryController.prototype, "category", null);
CategoryController = __decorate([
    controller('/categories'),
    __param(0, inject(CategoryRepository))
], CategoryController);
export { CategoryController };
//# sourceMappingURL=CategoryController.js.map