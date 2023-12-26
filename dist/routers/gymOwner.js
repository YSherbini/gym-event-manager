import { Router } from "express";
import auth from '../middleware/auth.js';
import { GymOwnerRepository } from '../repositories/gymOwner.js';
import { checkExistingEmailForUpdate, validateEmailForUpdate } from "../middleware/validate.js";
const router = Router();
const gymOwnerRepository = new GymOwnerRepository();
router.get('/gymOwners/profile', auth, async (req, res) => {
    try {
        res.send(req.gymOwner);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});
router.patch('/gymOwners/profile', auth, validateEmailForUpdate, checkExistingEmailForUpdate, async (req, res) => {
    const updates = req.body;
    try {
        if (!req.gymOwner) {
            return res.status(401).send();
        }
        Object.entries(updates).forEach(([field, fieldValue]) => {
            if (fieldValue !== undefined) {
                req.gymOwner[field] = fieldValue;
            }
        });
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
        res.status(400).send({ error: err.message });
    }
});
export default router;
//# sourceMappingURL=gymOwner.js.map