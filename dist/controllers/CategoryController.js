"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const CategoryRepository_js_1 = require("../repositories/CategoryRepository.js");
const inversify_1 = require("inversify");
const auth_js_1 = __importDefault(require("../middleware/auth.js"));
const validate_js_1 = require("../middleware/validate.js");
let CategoryController = class CategoryController {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    allCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.categoryRepository.getAll();
                res.send(categories);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    category(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const category = yield this.categoryRepository.getById(id);
                if (!category) {
                    return res.status(404).send('Category not found!');
                }
                res.send(category);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, inversify_express_utils_1.httpGet)('/', auth_js_1.default)
], CategoryController.prototype, "allCategories", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/:id', auth_js_1.default, validate_js_1.isValidObjectId)
], CategoryController.prototype, "category", null);
exports.CategoryController = CategoryController = __decorate([
    (0, inversify_express_utils_1.controller)('/categories'),
    __param(0, (0, inversify_1.inject)(CategoryRepository_js_1.CategoryRepository))
], CategoryController);
//# sourceMappingURL=CategoryController.js.map