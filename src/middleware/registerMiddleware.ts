import express from 'express';
import { container } from '../container/index.js';
import { RegisterRepository } from '../repositories/RegisterRepository.js';
import { IRequest } from '../interfaces/IRequest.js';

export const alreadyRegistered = async (req: IRequest, res: express.Response, next: express.NextFunction) => {
    const registerRepository = container.get<RegisterRepository>(RegisterRepository);

    const { eventId } = req.body

    if (await registerRepository.getOne({ gymOwnerId: req.gymOwner._id, eventId })) {
        return res.status(409).json({ error: 'Already Registered!' });
    }

    next();
};
