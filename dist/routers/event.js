import { Router } from "express";
import Event from "../models/event.js";
import auth from '../middleware/auth.js';
import Register from "../models/register.js";
import { isValidObjectId } from "../middleware/validate.js";
const router = Router();
// GET /events?category=Football&name=championship
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
router.get('/events/:id', auth, isValidObjectId, async (req, res) => {
    try {
        const register = await Register.findOne({ eventId: req.params.id, gymOwnerId: req.gymOwner._id }).populate('teams', "-__v");
        const event = await Event.findById({ _id: req.params.id }).populate('categories', "-__v");
        if (!event) {
            return res.status(404).send('Event not found!');
        }
        return res.send({ ...event.toObject(), registerId: register?._id, teams: register?.teams });
    }
    catch (err) {
        res.status(400).send(err);
    }
});
export default router;
//# sourceMappingURL=event.js.map