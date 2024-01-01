import express from 'express';
import { controller, httpDelete, httpPost } from 'inversify-express-utils';
import { GymOwnerRepository } from '../repositories/GymOwnerRepository.js';
import { checkExistingEmail, validateEmail, validatePassword } from '../middleware/validate.js';
import { IGymOwnerAuthParams } from '../interfaces/IGymOwner.js';
import { inject } from 'inversify';
import { IRequest } from '../interfaces/IRequest.js';
import auth from '../middleware/auth.js';

@controller('/gymOwners')
export class GymOwnerAuthController {
    constructor(@inject(GymOwnerRepository)private readonly gymOwnerRepository: GymOwnerRepository) {}

    @httpPost('/signup', validateEmail, validatePassword, checkExistingEmail)
    async signup(req: express.Request, res: express.Response) {
        const gymOwnerParams = req.body as IGymOwnerAuthParams;
    try{
        const gymOwner = await this.gymOwnerRepository.createUser(gymOwnerParams);
        const token = await this.gymOwnerRepository.generateAuthToken(gymOwner);
        res.status(201).send({ token });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
    }

    @httpPost('/login', validateEmail, validatePassword)
    async login(req: express.Request, res: express.Response) {
        const gymOwnerParams = req.body as IGymOwnerAuthParams;
    try{
        const gymOwner = await this.gymOwnerRepository.findByCredentials(gymOwnerParams);
        const token = await this.gymOwnerRepository.generateAuthToken(gymOwner);
        res.send({ token });
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
    }

    @httpDelete('/logout', auth)
    async logout(req: IRequest, res: express.Response) {
        const { gymOwner, token } = req
    try{
        gymOwner.tokens = gymOwner.tokens.filter((t: { token: string }) => t.token !== token);
        await this.gymOwnerRepository.save(gymOwner)
        res.send();
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
    }
}
