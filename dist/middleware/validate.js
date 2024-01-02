import { GymOwnerRepository } from '../repositories/GymOwnerRepository.js';
import { container } from '../container/index.js';
export const validateEmail = (req, res, next) => {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(422).json({ error: 'Invalid email format' });
    }
    next();
};
export const validatePassword = (req, res, next) => {
    const { password } = req.body;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
        return res.status(422).json({ error: 'Invalid password format' });
    }
    next();
};
export const validateName = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return res.status(422).json({ error: 'Name must be not empty' });
    }
    next();
};
export const checkExistingEmail = async (req, res, next) => {
    const gymOwnerRepository = container.get(GymOwnerRepository);
    const { email } = req.body;
    const existingUser = await gymOwnerRepository.getOne({ email });
    if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
    }
    next();
};
export const validateEmailForUpdate = (req, res, next) => {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email == '' || (email && !emailRegex.test(email))) {
        return res.status(422).json({ error: 'Invalid email format' });
    }
    next();
};
export const checkExistingEmailForUpdate = async (req, res, next) => {
    const gymOwnerRepository = container.get(GymOwnerRepository);
    const { email } = req.body;
    const id = req.gymOwner._id;
    const existingUser = await gymOwnerRepository.getOne({ email, _id: { $ne: id } });
    if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
    }
    next();
};
export const isValidObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(422).json({ error: 'Invalid ObjectId' });
    }
    next();
};
//# sourceMappingURL=validate.js.map