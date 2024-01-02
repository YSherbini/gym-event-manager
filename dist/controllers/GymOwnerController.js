var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { controller, httpPatch, httpDelete, httpGet } from 'inversify-express-utils';
import { GymOwnerRepository } from '../repositories/GymOwnerRepository.js';
import { inject } from 'inversify';
import auth from '../middleware/auth.js';
import { validateEmailForUpdate, checkExistingEmailForUpdate, validatePassword } from '../middleware/validate.js';
let GymOwnerController = class GymOwnerController {
    gymOwnerRepository;
    constructor(gymOwnerRepository) {
        this.gymOwnerRepository = gymOwnerRepository;
    }
    async profile(req, res) {
        res.send(req.gymOwner);
    }
    async EditProfile(req, res) {
        const updates = req.body;
        let { gymOwner } = req;
        try {
            gymOwner = await this.gymOwnerRepository.update(gymOwner, updates);
            res.send(gymOwner);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async changePassword(req, res) {
        const { password } = req.body;
        let { gymOwner } = req;
        try {
            gymOwner = await this.gymOwnerRepository.changePassword(gymOwner, password);
            res.send();
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async deleteProfile(req, res) {
        let { gymOwner } = req;
        try {
            gymOwner = await this.gymOwnerRepository.remove(gymOwner);
            res.send();
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};
__decorate([
    httpGet('/', auth)
], GymOwnerController.prototype, "profile", null);
__decorate([
    httpPatch('/', auth, validateEmailForUpdate, checkExistingEmailForUpdate)
], GymOwnerController.prototype, "EditProfile", null);
__decorate([
    httpPatch('/changePassword', auth, validatePassword)
], GymOwnerController.prototype, "changePassword", null);
__decorate([
    httpDelete('/', auth)
], GymOwnerController.prototype, "deleteProfile", null);
GymOwnerController = __decorate([
    controller('/gymOwners/profile'),
    __param(0, inject(GymOwnerRepository))
], GymOwnerController);
export { GymOwnerController };
//# sourceMappingURL=GymOwnerController.js.map