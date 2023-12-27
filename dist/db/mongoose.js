var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import mongoose from 'mongoose';
import 'dotenv/config';
import { injectable } from 'inversify';
let DBService = class DBService {
    async connect() {
        const { MONGODB_URL } = process.env;
        mongoose.connect(`mongodb://${MONGODB_URL}`, {
            useNewUrlParser: true,
            useCreateIndex: true,
        });
    }
};
DBService = __decorate([
    injectable()
], DBService);
export { DBService };
//# sourceMappingURL=mongoose.js.map