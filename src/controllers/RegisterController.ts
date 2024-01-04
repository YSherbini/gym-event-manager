import express from 'express';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { IRequest } from '../interfaces/IRequest';
import auth from '../middleware/auth';
import { alreadyRegistered } from '../middleware/registerMiddleware';
import { isValidObjectId } from '../middleware/validate';
import { RegisterRepository } from '../repositories/RegisterRepository';
import { IRegisterQuery, IRegisterParams } from '../interfaces/IRegister';

@controller('/registers', auth)
export class RegisterController {
    constructor(@inject(RegisterRepository) private readonly registerRepository: RegisterRepository) {}

    @httpPost('/', alreadyRegistered)
    async createRegister(req: IRequest, res: express.Response) {
        const { eventId } = req.body as { eventId: string };
        const registerParams = { gymOwnerId: req.gymOwner._id, eventId } as IRegisterParams;

        try {
            const register = await this.registerRepository.register(registerParams);
            await register.populate('event', '-__v').execPopulate();

            res.status(201).send(register);
        } catch (err: any) {
            res.status(400).send({ error: err.message });
        }
    }

    @httpGet('/')
    async allRegisters(req: IRequest, res: express.Response) {
        const registerQuery = req.query as IRegisterQuery;
        const gymOwnerId = req.gymOwner._id;

        const eventMatch = this.registerRepository.applyQuery(registerQuery);
        const registers = await this.registerRepository.getAllMatch({ gymOwnerId }, eventMatch);

        res.send(registers);
    }

    @httpGet('/:id', isValidObjectId)
    async register(req: IRequest, res: express.Response) {
        const { id } = req.params;
        const gymOwnerId = req.gymOwner._id;

        const register = await this.registerRepository.getOne({ _id: id, gymOwnerId }, 'teams event');

        if (!register) {
            return res.status(404).send('Register not found!');
        }

        res.send(register);
    }

    @httpDelete('/:id', isValidObjectId)
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
