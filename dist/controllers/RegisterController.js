var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import auth from '../middleware/auth.js';
import { alreadyRegistered } from '../middleware/registerMiddleware.js';
import { isValidObjectId } from '../middleware/validate.js';
import { RegisterRepository } from '../repositories/RegisterRepository.js';
let RegisterController = class RegisterController {
    registerRepository;
    constructor(registerRepository) {
        this.registerRepository = registerRepository;
    }
    async createRegister(req, res) {
        const { eventId } = req.body;
        const registerParams = { gymOwnerId: req.gymOwner._id, eventId };
        try {
            const register = await this.registerRepository.register(registerParams);
            await register.populate('event', '-__v').execPopulate();
            res.status(201).send(register);
        }
        catch (err) {
            res.status(400).send({ error: err.message });
        }
    }
    async allRegisters(req, res) {
        const registerQuery = req.query;
        const gymOwnerId = req.gymOwner._id;
        const eventMatch = this.registerRepository.applyQuery(registerQuery);
        const registers = await this.registerRepository.getAllMatch({ gymOwnerId }, eventMatch);
        res.send(registers);
    }
    async register(req, res) {
        const { id } = req.params;
        const gymOwnerId = req.gymOwner._id;
        const register = await this.registerRepository.getOne({ _id: id, gymOwnerId }, 'teams event');
        if (!register) {
            return res.status(404).send('Register not found!');
        }
        res.send(register);
    }
    async unregister(req, res) {
        const { id } = req.params;
        const gymOwnerId = req.gymOwner._id;
        try {
            const register = await this.registerRepository.getOne({ _id: id, gymOwnerId });
            if (!register) {
                return res.status(404).send('Register not found!');
            }
            await this.registerRepository.remove(register);
            res.send();
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};
__decorate([
    httpPost('/', alreadyRegistered)
], RegisterController.prototype, "createRegister", null);
__decorate([
    httpGet('/')
], RegisterController.prototype, "allRegisters", null);
__decorate([
    httpGet('/:id', isValidObjectId)
], RegisterController.prototype, "register", null);
__decorate([
    httpDelete('/:id', isValidObjectId)
], RegisterController.prototype, "unregister", null);
RegisterController = __decorate([
    controller('/registers', auth),
    __param(0, inject(RegisterRepository))
], RegisterController);
export { RegisterController };
//# sourceMappingURL=RegisterController.js.map