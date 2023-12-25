import express from "express";
import GymOwner from "../models/gymOwner.js";
import { MyRequest } from "../interfaces/MyRequest.js";

export const validateEmail = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email } = req.body;
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    next();
};

export const validatePassword = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { password } = req.body;
    const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Invalid password format' });
    }

    next();
};

export const checkExistingEmail = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email } = req.body;
    try {
        const existingUser = await GymOwner.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};

export const validateEmailForUpdate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email } = req.body;
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    next(); 
};

export const checkExistingEmailForUpdate = async (req: MyRequest, res: express.Response, next: express.NextFunction) => {
    const { email } = req.body;
    try {
        if (!req.gymOwner) {
            return res.status(401).json({ error: 'UnAuthenticated' })
        }
        const id = req.gymOwner._id; 
        if (email) {
            const existingUser = await GymOwner.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(409).json({ error: 'Email already exists' });
            }
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};