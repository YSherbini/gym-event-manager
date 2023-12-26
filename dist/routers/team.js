import { Router } from 'express';
import Team from '../models/team.js';
import auth from '../middleware/auth.js';
import Register from '../models/register.js';
import { isValidObjectId } from '../middleware/validate.js';
const router = Router();
router.post('/teams', auth, async (req, res) => {
    const { name, categoryId } = req.body;
    try {
        if (typeof req.gymOwner === 'undefined') {
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
            name,
            categoryId,
            gymOwnerId: req.gymOwner._id,
            registerId: register._id,
            eventId: register.eventId,
        });
        await team.save();
        res.status(201).send(team);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
// GET /teams?category=Football&limit=10&skip=0&sortBy=name:asc
router.get('/teams', auth, async (req, res) => {
    const { categoryId, sortBy, limit, skip } = req.query;
    const match = {};
    const sort = {};
    console.log(categoryId, sortBy, limit, skip);
    if (categoryId) {
        match.categoryId = categoryId;
    }
    if (sortBy) {
        const [sortee, order] = sortBy.split(':');
        sort[sortee] = order === 'desc' ? -1 : 1;
    }
    console.log(sort);
    try {
        if (typeof req.gymOwner === 'undefined') {
            return res.status(400).send();
        }
        await req.gymOwner
            .populate({
            path: 'teams',
            match,
            options: {
                limit: parseInt(limit ? limit : ''),
                skip: parseInt(skip ? skip : ''),
                sort,
            },
        })
            .execPopulate();
        res.send(req.gymOwner.teams);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
router.get('/teams/:id', auth, isValidObjectId, async (req, res) => {
    try {
        if (typeof req.gymOwner === 'undefined') {
            return res.status(400).send('GymOwner not available');
        }
        const team = await Team.findOne({ _id: req.params.id }).populate('category event', '-__v');
        if (!team) {
            return res.status(404).send('Team not found!');
        }
        res.send(team);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
router.patch('/teams/:id', auth, isValidObjectId, async (req, res) => {
    const updates = req.body;
    try {
        if (typeof req.gymOwner === 'undefined') {
            return res.status(400).send('GymOwner not available');
        }
        const team = await Team.findOne({ _id: req.params.id, gymOwnerId: req.gymOwner._id }).populate('event');
        if (!team) {
            return res.status(404).send();
        }
        if (req.body.categoryId && team.event && !team.event.categoriesIds.includes(req.body.categoryId)) {
            return res.status(400).send('Categories doesnt match!');
        }
        Object.entries(updates).forEach(([field, fieldValue]) => {
            if (fieldValue !== undefined) {
                team[field] = fieldValue;
            }
        });
        await team.save();
        res.send(team);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
router.delete('/teams/:id', auth, isValidObjectId, async (req, res) => {
    try {
        if (typeof req.gymOwner === 'undefined') {
            return res.status(400).send('GymOwner not available');
        }
        const team = await Team.findOneAndDelete({ _id: req.params.id, gymOwnerId: req.gymOwner._id });
        if (!team) {
            res.status(404).send();
        }
        res.send();
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
export default router;
//# sourceMappingURL=team.js.map