import express from 'express';
import { controller, httpPatch, httpDelete, httpGet } from 'inversify-express-utils';
import { GymOwnerRepository } from '../repositories/GymOwnerRepository';
import { IGymOwnerParams } from '../interfaces/IGymOwner';
import { inject } from 'inversify';
import { IRequest } from '../interfaces/IRequest';
import auth from '../middleware/auth';
import { validateEmailForUpdate, checkExistingEmailForUpdate, validatePassword, validateNameForUpdate } from '../middleware/validate';

@controller('/gymOwners/profile', auth)
export class GymOwnerController {
    constructor(@inject(GymOwnerRepository) private readonly gymOwnerRepository: GymOwnerRepository) {}

    @httpGet('/')
    async profile(req: IRequest, res: express.Response) {
        res.send(req.gymOwner);
    }

    @httpPatch('/', validateNameForUpdate, validateEmailForUpdate, checkExistingEmailForUpdate)
    async EditProfile(req: IRequest, res: express.Response) {
        const updates = req.body as IGymOwnerParams;
        let { gymOwner } = req;

        try {
            gymOwner = await this.gymOwnerRepository.update(gymOwner, updates);

            res.send(gymOwner);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    @httpPatch('/changePassword', validatePassword)
    async changePassword(req: IRequest, res: express.Response) {
        const { password } = req.body;
        let { gymOwner } = req;

        try {
            gymOwner = await this.gymOwnerRepository.changePassword(gymOwner, password);

            res.send();
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    @httpDelete('/')
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
