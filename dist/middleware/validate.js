import GymOwner from "../models/gymOwner.js";
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
export const checkExistingEmail = async (req, res, next) => {
    const { email } = req.body;
    try {
        const existingUser = await GymOwner.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        next();
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
export const validateEmailForUpdate = (req, res, next) => {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email == "" || email && !emailRegex.test(email)) {
        return res.status(422).json({ error: 'Invalid email format' });
    }
    next();
};
export const checkExistingEmailForUpdate = async (req, res, next) => {
    const { email } = req.body;
    try {
        const id = req.gymOwner._id;
        const existingUser = await GymOwner.findOne({ email, _id: { $ne: id } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        next();
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
export const isValidObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(422).json({ error: 'Invalid ObjectId' });
        ;
    }
    next();
};
//# sourceMappingURL=validate.js.map