import { Router } from "express";
import auth from '../middleware/auth.js'
import Category from "../models/category.js";
import { isValidObjectId } from "../middleware/validate.js";
const router = Router()

// Read categories
router.get('/categories', auth, async (req, res) => {
    try {
        const categories = await Category.find()
        res.send(categories)
    } catch (err: any) {
        res.status(400).send({error: err.message})
    }
})

// GET category by id
router.get('/categories/:id', auth, isValidObjectId, async (req, res) => {
    try {
        const category = await Category.findById({_id: req.params.id})
        if (!category) {
            return res.status(404).send('Category not found!')
        }
        res.send(category)
    } catch (err: any) {
        res.status(400).send({error: err.message})
    }
})

export default router;