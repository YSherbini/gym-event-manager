var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { controller, httpDelete, httpPost } from 'inversify-express-utils';
import { GymOwnerRepository } from '../repositories/GymOwnerRepository.js';
import { checkExistingEmail, validateName, validateEmail, validatePassword } from '../middleware/validate.js';
import { inject } from 'inversify';
import auth from '../middleware/auth.js';
let GymOwnerAuthController = class GymOwnerAuthController {
    gymOwnerRepository;
    constructor(gymOwnerRepository) {
        this.gymOwnerRepository = gymOwnerRepository;
    }
    async signup(req, res) {
        const gymOwnerParams = req.body;
        const gymOwner = await this.gymOwnerRepository.createUser(gymOwnerParams);
        const token = await this.gymOwnerRepository.generateAuthToken(gymOwner);
        res.status(201).send({ token });
    }
    async login(req, res) {
        const gymOwnerParams = req.body;
        try {
            const gymOwner = await this.gymOwnerRepository.findByCredentials(gymOwnerParams);
            const token = await this.gymOwnerRepository.generateAuthToken(gymOwner);
            res.send({ token });
        }
        catch (err) {
            res.status(401).json({ error: err.message });
        }
    }
    async logout(req, res) {
        const { gymOwner, token } = req;
        try {
            gymOwner.tokens = gymOwner.tokens.filter((t) => t.token !== token);
            await this.gymOwnerRepository.save(gymOwner);
            res.send();
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};
__decorate([
    httpPost('/signup', validateName, validateEmail, validatePassword, checkExistingEmail)
], GymOwnerAuthController.prototype, "signup", null);
__decorate([
    httpPost('/login', validateEmail, validatePassword)
], GymOwnerAuthController.prototype, "login", null);
__decorate([
    httpDelete('/logout', auth)
], GymOwnerAuthController.prototype, "logout", null);
GymOwnerAuthController = __decorate([
    controller('/gymOwners'),
    __param(0, inject(GymOwnerRepository))
], GymOwnerAuthController);
export { GymOwnerAuthController };
//# sourceMappingURL=GymOwnerAuthController.js.map