import express from 'express';
import { IRequest } from '../interfaces/IRequest.js';
import { GymOwnerRepository } from '../repositories/GymOwnerRepository.js';
import { container } from '../container/index.js';

export const validateEmail = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email } = req.body;
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        return res.status(422).json({ error: 'Invalid email format' });
    }

    next();
};

export const validatePassword = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { password } = req.body;
    const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!password || !passwordRegex.test(password)) {
        return res.status(422).json({ error: 'Invalid password format' });
    }

    next();
};

export const validateName = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { name } = req.body;
    
    if (!name) {
        return res.status(422).json({ error: 'Name must be not empty' });
    }

    next();
};

export const checkExistingEmail = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const gymOwnerRepository = container.get<GymOwnerRepository>(GymOwnerRepository);

    const { email } = req.body;

    const existingUser = await gymOwnerRepository.getOne({ email });

    if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
    }

    next();
};

export const validateEmailForUpdate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email } = req.body;
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email == '' || (email && !emailRegex.test(email))) {
        return res.status(422).json({ error: 'Invalid email format' });
    }

    next();
};

export const checkExistingEmailForUpdate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const gymOwnerRepository = container.get<GymOwnerRepository>(GymOwnerRepository);

    const { email } = req.body;
    const id = (req as IRequest).gymOwner._id;

    const existingUser = await gymOwnerRepository.getOne({ email, _id: { $ne: id } });

    if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
    }

    next();
};

export const isValidObjectId = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(422).json({ error: 'Invalid ObjectId' });
    }
    next();
};
