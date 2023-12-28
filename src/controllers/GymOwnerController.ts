import express from 'express';
import { controller, httpPatch, httpDelete, httpGet } from 'inversify-express-utils';
import { GymOwnerRepository } from '../repositories/GymOwnerRepository.js';
import { IGymOwnerParams } from '../interfaces/IGymOwner.js';
import { inject } from 'inversify';
import { IRequest } from '../interfaces/IRequest.js';
import auth from '../middleware/auth.js';
import { validateEmailForUpdate, checkExistingEmailForUpdate } from '../middleware/validate.js';

@controller('/gymOwners')
export class GymOwnerController {
    constructor(@inject(GymOwnerRepository) private readonly gymOwnerRepository: GymOwnerRepository) {}

    @httpGet('/profile', auth)
    async profile(req: IRequest, res: express.Response) {
        try {
            res.send(req.gymOwner);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    @httpPatch('/profile', auth, validateEmailForUpdate, checkExistingEmailForUpdate)
    async EditProfile(req: IRequest, res: express.Response) {
        const updates = req.body as IGymOwnerParams;
        let { gymOwner } = req
        try {
            gymOwner = await this.gymOwnerRepository.update(gymOwner, updates);
            res.send(gymOwner)
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    @httpDelete('/profile', auth)
    async deleteProfile(req: IRequest, res: express.Response) {
        let { gymOwner } = req;
        try {
            gymOwner = await this.gymOwnerRepository.remove(gymOwner);
            res.send();
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}
