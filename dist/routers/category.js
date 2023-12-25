import { Router } from "express";
import auth from '../middleware/auth.js';
import Category from "../models/category.js";
const router = Router();
// Read categories
router.get('/categories', auth, async (req, res) => {
    try {
        const categories = await Category.find();
        res.send(categories);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
// GET category by id
router.get('/categories/:id', auth, async (req, res) => {
    try {
        const category = await Category.findById({ _id: req.params.id });
        if (!category) {
            return res.status(404).send('Category not found!');
        }
        res.send(category);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
export default router;
//# sourceMappingURL=category.js.map