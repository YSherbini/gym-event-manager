import { Router } from "express";
import Register from "../models/register.js";
import auth from '../middleware/auth.js';
import { isValidObjectId } from "../middleware/validate.js";
const router = Router();
router.post('/registers', auth, async (req, res) => {
    if (typeof req.gymOwner === "undefined") {
        return res.status(400).send();
    }
    const { eventId } = req.body;
    const register = new Register({
        eventId: req.body.eventId,
        gymOwnerId: req.gymOwner._id
    });
    try {
        if (await Register.findOne({ eventId, gymOwnerId: req.gymOwner._id })) {
            throw new Error('Already regestered!');
        }
        await register.save();
        await register.populate('event', "-__v").execPopulate();
        res.status(201).send(register);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
router.get('/registers', auth, async (req, res) => {
    try {
        if (typeof req.gymOwner === "undefined") {
            return res.status(400).send('GymOwner not available');
        }
        const { name, categoryId } = req.query;
        let registers = await Register.find({ gymOwnerId: req.gymOwner._id }).populate('event', "-__v");
        registers = registers.filter((register) => {
            const event = register.event;
            if (typeof name === 'string') {
                return event && event.name.toLowerCase().includes(name.toLowerCase());
            }
            else
                return true;
        });
        registers = registers.filter((register) => {
            const event = register.event;
            if (typeof categoryId === 'string' && categoryId) {
                return event && event.categoriesIds.includes(categoryId);
            }
            else
                return true;
        });
        res.send(registers);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
router.get('/registers/:id', auth, isValidObjectId, async (req, res) => {
    try {
        if (typeof req.gymOwner === "undefined") {
            return res.status(400).send('GymOwner not available');
        }
        const register = await Register.findOne({ _id: req.params.id, gymOwnerId: req.gymOwner._id }).populate('teams event', "-__v");
        if (!register) {
            return res.status(404).send('Register not found!');
        }
        res.send(register);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
router.delete('/registers/:id', auth, isValidObjectId, async (req, res) => {
    try {
        if (typeof req.gymOwner === "undefined") {
            return res.status(400).send('GymOwner not available');
        }
        const register = await Register.findOne({ _id: req.params.id, gymOwnerId: req.gymOwner._id });
        if (!register) {
            return res.status(404).send('Register not found!');
        }
        await register.remove();
        res.send();
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
export default router;
//# sourceMappingURL=register.js.map