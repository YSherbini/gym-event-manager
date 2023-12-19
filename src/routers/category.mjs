import { Router } from "express";
import auth from '../middleware/auth.mjs'
import Category from "../models/category.mjs";
const router = new Router()

// Read categories
router.get('/categories', auth, async (req, res) => {
    try {
        const categories = await Category.find()
        res.send(categories)
    } catch (err) {
        res.status(400).send(err)
    }
})

// GET category by id
router.get('/categories/:id', auth, async (req, res) => {
    try {
        const category = await Category.findById({_id: req.params.id})
        res.send(category)
    } catch (err) {
        res.status(400).send(err)
    }
})

export default router;