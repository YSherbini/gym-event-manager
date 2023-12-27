import express from 'express';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { IRequest } from '../interfaces/IRequest.js';
import auth from '../middleware/auth.js';
import { isValidObjectId } from '../middleware/validate.js';
import { RegisterRepository } from '../repositories/RegisterRepository.js';
import { IRegisterParams } from '../interfaces/IRegister.js';
import { IQuery } from '../interfaces/IQuery.js';

@controller('/registers')
export class RegisterController {
    constructor(@inject(RegisterRepository) private readonly registerRepository: RegisterRepository) {}

    @httpPost('/', auth)
    async createRegister(req: IRequest, res: express.Response) {
        const { eventId } = req.body as { eventId: string };
        const registerParams = { gymOwnerId: req.gymOwner._id, eventId } as IRegisterParams;
        try {
            await this.registerRepository.alreadyExists(registerParams);
            const register = await this.registerRepository.register(registerParams);
            await register.populate('event', '-__v').execPopulate();
            res.status(201).send(register);
        } catch (err: any) {
            res.status(400).send({ error: err.message });
        }
    }

    @httpGet('/', auth)
    async allRegisters(req: IRequest, res: express.Response) {
        const registerQuery = req.query as IQuery;
        const gymOwnerId = req.gymOwner._id;
        try {
            let registers = await this.registerRepository.getAllMatch({ gymOwnerId }, 'event');
            registers = this.registerRepository.applyQuery(registers, registerQuery);
            res.send(registers);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    @httpGet('/:id', auth, isValidObjectId)
    async register(req: IRequest, res: express.Response) {
        const { id } = req.params;
        const gymOwnerId = req.gymOwner._id;
        try {
            const register = await this.registerRepository.getOne({ _id: id, gymOwnerId }, 'teams event');
            if (!register) {
                return res.status(404).send('Register not found!');
            }
            res.send(register);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    @httpDelete('/:id', auth, isValidObjectId)
    async unregister(req: IRequest, res: express.Response) {
        const { id } = req.params;
        const gymOwnerId = req.gymOwner._id;
        try {
            const register = await this.registerRepository.getOne({ _id: id, gymOwnerId });
            if (!register) {
                return res.status(404).send('Register not found!');
            }
            await this.registerRepository.remove(register);
            res.send();
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}
