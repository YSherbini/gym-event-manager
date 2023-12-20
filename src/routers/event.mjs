import { Router } from "express";
import Event from "../models/event.mjs";
import auth from '../middleware/auth.mjs'
import Category from "../models/category.mjs";
import Register from "../models/register.mjs";
const router = new Router()

// Read events
// GET /events?category=Football
router.get('/events', auth, async (req, res) => {
    const match = {}
    if (req.query.category) {
        match['categoriesIds'] = await Category.findOne({ name: req.query.category.toLowerCase() })
    }
    try {
        const events = await Event.find(match)
        res.send(events)
    } catch (err) {
        res.status(400).send(err)
    }
})

// GET event by id
router.get('/events/:id', auth, async (req, res) => {
    try {
        const register = await Register.findOne({ eventId: req.params.id, gymOwnerId: req.gymOwner._id })
        const event = await Event.findById({_id: req.params.id}).populate('categories teams')
        if (register) {
            return res.send({...event.toObject(), registerId: register._id})
        }
        if (!event) {
            return res.status(404).send('Event not found!')
        }
        res.send(event)
    } catch (err) {
        res.status(400).send(err)
    }
})

export default router;