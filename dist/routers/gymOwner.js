import { Router } from "express";
import GymOwner from '../models/gymOwner.js';
import auth from '../middleware/auth.js';
import { GymOwnerRepository } from '../repositories/gymOwner.js';
import { checkExistingEmail, checkExistingEmailForUpdate, validateEmail, validateEmailForUpdate, validatePassword } from "../middleware/validate.js";
const router = Router();
const gymOwnerRepository = new GymOwnerRepository();
// Signup
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
// Login
router.post('/gymOwners/login', validateEmail, validatePassword, async (req, res) => {
    try {
        const gymOwner = await gymOwnerRepository.findByCredentials(req.body.email, req.body.password);
        const token = await gymOwnerRepository.generateAuthToken(gymOwner);
        res.send({ token });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Logout
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
        res.status(500).send({ error: err.message });
    }
});
// Profile
router.get('/gymOwners/profile', auth, async (req, res) => {
    try {
        res.send(req.gymOwner);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
router.patch('/gymOwners/profile', auth, validateEmailForUpdate, checkExistingEmailForUpdate, async (req, res) => {
    const { name, email, image } = req.body;
    try {
        if (!req.gymOwner) {
            return res.status(401).send();
        }
        if (name) {
            req.gymOwner.name = name;
        }
        if (email) {
            req.gymOwner.email = email;
        }
        if (image) {
            req.gymOwner.image = image;
        }
        // updates.forEach((update) => req.gymOwner[update] = req.body[update])
        await req.gymOwner.save();
        res.send(req.gymOwner);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
router.delete('/gymOwners/profile', auth, async (req, res) => {
    try {
        if (typeof req.gymOwner === 'undefined') {
            return res.status(401).send();
        }
        await req.gymOwner.remove();
        res.send();
    }
    catch (err) {
        res.status(500).send({ error: err.message });
    }
});
export default router;
//# sourceMappingURL=gymOwner.js.map