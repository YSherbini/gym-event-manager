import { Router } from 'express';
import Register from '../models/register.js';
import auth from '../middleware/auth.js';
import { IRequest } from '../interfaces/IRequest.js';
import { IRegister } from '../interfaces/Register.interface.js';
import { isValidObjectId } from '../middleware/validate.js';
const router = Router();

type RegisterQuery = {
    name: string;
    categoryId: string;
};

router.post('/registers', auth, async (req: IRequest, res) => {
    if (typeof req.gymOwner === 'undefined') {
        return res.status(400).send();
    }
    const { eventId } = req.body as { eventId: string};
    const gymOwnerId = req.gymOwner._id;
    const register = new Register({ eventId, gymOwnerId });
    try {
        if (await Register.findOne({ eventId, gymOwnerId })) {
            throw new Error('Already regestered!');
        }
        await register.save();
        await register.populate('event', '-__v').execPopulate();
        res.status(201).send(register);
    } catch (err: any) {
        res.status(400).send({ error: err.message });
    }
});

router.get('/registers', auth, async (req: IRequest, res) => {
    try {
        if (typeof req.gymOwner === 'undefined') {
            return res.status(400).send('GymOwner not available');
        }
        const { name, categoryId } = req.query as RegisterQuery;
        let registers = await Register.find({ gymOwnerId: req.gymOwner._id }).populate('event', '-__v');
        registers = registers.filter((register: IRegister) => {
            const event = register.event;
            if (name || categoryId) {
                return event && (event.name.toLowerCase().includes(name?.toLowerCase()) || event.categoriesIds.includes(categoryId));
            } else return true;
        });
        res.send(registers);
    } catch (err: any) {
        res.status(400).send({ error: err.message });
    }
});

router.get('/registers/:id', auth, isValidObjectId, async (req: IRequest, res) => {
    try {
        if (typeof req.gymOwner === 'undefined') {
            return res.status(400).send('GymOwner not available');
        }
        const register = await Register.findOne({ _id: req.params.id, gymOwnerId: req.gymOwner._id }).populate('teams event', '-__v');
        if (!register) {
            return res.status(404).send('Register not found!');
        }
        res.send(register);
    } catch (err: any) {
        res.status(400).send({ error: err.message });
    }
});

router.delete('/registers/:id', auth, isValidObjectId, async (req: IRequest, res) => {
    try {
        if (typeof req.gymOwner === 'undefined') {
            return res.status(400).send('GymOwner not available');
        }
        const register = await Register.findOne({ _id: req.params.id, gymOwnerId: req.gymOwner._id });
        if (!register) {
            return res.status(404).send('Register not found!');
        }
        await register.remove();
        res.send();
    } catch (err: any) {
        res.status(400).send({ error: err.message });
    }
});

export default router;
