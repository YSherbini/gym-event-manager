import { Router } from 'express';
import GymOwner from '../models/gymOwner.js';
import auth from '../middleware/auth.js';
import { IRequest } from '../interfaces/IRequest.js';
import { GymOwnerRepository } from '../repositories/gymOwner.js';
import { checkExistingEmail, validateEmail, validatePassword } from '../middleware/validate.js';
const router = Router();
const gymOwnerRepository = new GymOwnerRepository();

interface IGymOwnerParams {
    name: string;
    email: string;
    password: string;
}

router.post('/gymOwners/signup', validateEmail, validatePassword, checkExistingEmail, async (req, res) => {
    const { name, email, password } = req.body as IGymOwnerParams;
    const gymOwner = new GymOwner({ name, email, password });
    try {
        await gymOwner.save();
        const token = await gymOwnerRepository.generateAuthToken(gymOwner);
        res.status(201).send({ token });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/gymOwners/login', validateEmail, validatePassword, async (req, res) => {
    try {
        const { email, password } = req.body as IGymOwnerParams;
        const gymOwner = await gymOwnerRepository.findByCredentials(email, password);
        const token = await gymOwnerRepository.generateAuthToken(gymOwner);
        res.send({ token });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/gymOwners/logout', auth, async (req: IRequest, res) => {
    try {
        if (typeof req.gymOwner === 'undefined') {
            return res.status(401).send();
        }
        req.gymOwner.tokens = req.gymOwner.tokens.filter((token: { token: string }) => token.token !== req.token);
        await req.gymOwner.save();
        res.send();
    } catch (err: any) {
        res.status(400).send({ error: err.message });
    }
});

export default router;
