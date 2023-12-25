import { Router } from "express";
import Register from "../models/register.js";
import auth from '../middleware/auth.js';
const router = Router();
// register
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
        await register.populate('event').execPopulate();
        res.status(201).send(register);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
// Get registers
router.get('/registers', auth, async (req, res) => {
    try {
        if (typeof req.gymOwner === "undefined") {
            return res.status(400).send('GymOwner not available');
        }
        const { name, categoryId } = req.query;
        // const match: any = {gymOwnerId: req.gymOwner._id}
        // if (typeof name === 'string') {
        //     match['event'] = {name: {$regex: new RegExp(name, 'i')}}
        // }
        // if (typeof categoryId === "string" && categoryId != "") {
        //     match['event'] = { categoriesIds: { categoryId: categoryId }}
        // }
        let registers = await Register.find({ gymOwnerId: req.gymOwner._id }).populate('event');
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
// Get register/registerd teams
router.get('/registers/:id', auth, async (req, res) => {
    try {
        if (typeof req.gymOwner === "undefined") {
            return res.status(400).send('GymOwner not available');
        }
        const register = await Register.findOne({ _id: req.params.id, gymOwnerId: req.gymOwner._id }).populate('teams event');
        if (!register) {
            return res.status(404).send('Register not found!');
        }
        res.send(register);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
// Delete register
router.delete('/registers/:id', auth, async (req, res) => {
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
        res.status(500).send({ error: err.message });
    }
});
export default router;
//# sourceMappingURL=register.js.map