import { Router } from "express";
import Team from '../models/team.js';
import auth from '../middleware/auth.js';
import Register from "../models/register.js";
import { isValidObjectId } from "../middleware/validate.js";
const router = Router();
// Create team
router.post('/teams', auth, async (req, res) => {
    try {
        if (typeof req.gymOwner === "undefined") {
            return res.status(400).send();
        }
        const register = await Register.findOne({ _id: req.body.registerId, gymOwnerId: req.gymOwner._id }).populate('event teams');
        if (!register) {
            return res.status(404).send('Register not found!');
        }
        if (register.event && !register.event.categoriesIds.includes(req.body.categoryId)) {
            return res.status(400).send('Categories doesnt match!');
        }
        const team = new Team({
            name: req.body.name,
            categoryId: req.body.categoryId,
            gymOwnerId: req.gymOwner._id,
            registerId: register._id,
            eventId: register.eventId
        });
        await team.save();
        res.status(201).send(team);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
// Read my teams
// GET /teams?category=Football
// GET /teams?limit=10&skip=0
// GET /teams?sortBy=createdAt:asc
router.get('/teams', auth, async (req, res) => {
    const match = {};
    const sort = {};
    if (typeof req.query.categoryId === 'string') {
        match.categoryId = req.query.categoryId;
    }
    if (req.query.sortBy) {
        if (typeof req.query.sortBy === 'string') {
            const [sortBy, order] = req.query.sortBy.split(':');
            sort.sortBy = order === 'desc' ? -1 : 1;
        }
    }
    try {
        if (typeof req.gymOwner === "undefined") {
            return res.status(400).send();
        }
        await req.gymOwner.populate({
            path: 'teams',
            match,
            options: {
                limit: parseInt(typeof req.query.limit === 'string' ? req.query.limit : ""),
                skip: parseInt(typeof req.query.skip === 'string' ? req.query.skip : ""),
                sort
            }
        }).execPopulate();
        res.send(req.gymOwner.teams);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
// Read team by ID
router.get('/teams/:id', auth, isValidObjectId, async (req, res) => {
    try {
        if (typeof req.gymOwner === "undefined") {
            return res.status(400).send('GymOwner not available');
        }
        const team = await Team.findOne({ _id: req.params.id, gymOwnerId: req.gymOwner._id }).populate('category event');
        if (!team) {
            return res.status(404).send('Team not found!');
        }
        res.send(team);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
// Update team by ID
router.patch('/teams/:id', auth, isValidObjectId, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'categoryId', 'image'];
    const isValidOp = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOp) {
        return res.status(400).send();
    }
    try {
        if (typeof req.gymOwner === "undefined") {
            return res.status(400).send('GymOwner not available');
        }
        const team = await Team.findOne({ _id: req.params.id, gymOwnerId: req.gymOwner._id });
        const register = await Register.findOne({ _id: team.registerId, gymOwnerId: req.gymOwner._id }).populate('event');
        if (!team || !register) {
            return res.status(404).send();
        }
        if (req.body.categoryId && register.event && !register.event.categoriesIds.includes(req.body.categoryId)) {
            return res.status(400).send('Categories doesnt match!');
        }
        updates.forEach((update) => team[update] = req.body[update]);
        await team.save();
        res.send(team);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
// Delete team by ID
router.delete('/teams/:id', auth, isValidObjectId, async (req, res) => {
    try {
        if (typeof req.gymOwner === "undefined") {
            return res.status(400).send('GymOwner not available');
        }
        const team = await Team.findOneAndDelete({ _id: req.params.id, gymOwnerId: req.gymOwner._id });
        if (!team) {
            res.status(404).send();
        }
        res.send();
    }
    catch (err) {
        res.status(500).send({ error: err.message });
    }
});
export default router;
//# sourceMappingURL=team.js.map