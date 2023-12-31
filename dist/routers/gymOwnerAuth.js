import { Router } from 'express';
import GymOwner from '../models/gymOwner.js';
import auth from '../middleware/auth.js';
import { GymOwnerRepository } from '../repositories/gymOwner.js';
import { checkExistingEmail, validateEmail, validatePassword } from '../middleware/validate.js';
const router = Router();
const gymOwnerRepository = new GymOwnerRepository();
router.post('/gymOwners/signup', validateEmail, validatePassword, checkExistingEmail, async (req, res) => {
    const { name, email, password } = req.body;
    const gymOwner = new GymOwner({ name, email, password });
    try {
        await gymOwner.save();
        const token = await gymOwnerRepository.generateAuthToken(gymOwner);
        res.status(201).send({ token });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.post('/gymOwners/login', validateEmail, validatePassword, async (req, res) => {
    try {
        const { email, password } = req.body;
        const gymOwner = await gymOwnerRepository.findByCredentials(email, password);
        const token = await gymOwnerRepository.generateAuthToken(gymOwner);
        res.send({ token });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.delete('/gymOwners/logout', auth, async (req, res) => {
    try {
        if (typeof req.gymOwner === 'undefined') {
            return res.status(401).send();
        }
        req.gymOwner.tokens = req.gymOwner.tokens.filter((token) => token.token !== req.token);
        await req.gymOwner.save();
        res.send();
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
export default router;
//# sourceMappingURL=gymOwnerAuth.js.map