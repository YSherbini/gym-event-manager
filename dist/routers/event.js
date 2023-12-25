import { Router } from "express";
import Event from "../models/event.js";
import auth from '../middleware/auth.js';
import Register from "../models/register.js";
const router = Router();
// Read events
// GET /events?category=Football
router.get('/events', auth, async (req, res) => {
    try {
        const { name, categoryId } = req.query;
        const match = {};
        if (typeof name === 'string') {
            match['name'] = { $regex: new RegExp(name, 'i') };
        }
        if (typeof categoryId === "string" && categoryId != "") {
            match['categoriesIds'] = { _id: categoryId };
        }
        const events = await Event.find(match);
        res.send(events);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
// GET event by id
router.get('/events/:id', auth, async (req, res) => {
    try {
        if (typeof req.gymOwner === 'undefined') {
            return res.status(500).send();
        }
        const register = await Register.findOne({ eventId: req.params.id, gymOwnerId: req.gymOwner._id }).populate('teams');
        const event = await Event.findById({ _id: req.params.id }).populate('categories');
        if (register && event) {
            return res.send({ ...event.toObject(), registerId: register._id, teams: register.teams });
        }
        if (!event) {
            return res.status(404).send('Event not found!');
        }
        res.send(event);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
export default router;
//# sourceMappingURL=event.js.map