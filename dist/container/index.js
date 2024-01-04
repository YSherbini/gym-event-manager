"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const mongoose_1 = require("../db/mongoose");
const inversify_1 = require("inversify");
const CategoryRepository_1 = require("../repositories/CategoryRepository");
const GymOwnerRepository_1 = require("../repositories/GymOwnerRepository");
const EventRepository_1 = require("../repositories/EventRepository");
const RegisterRepository_1 = require("../repositories/RegisterRepository");
const TeamRepository_1 = require("../repositories/TeamRepository");
exports.container = new inversify_1.Container({
    defaultScope: 'Singleton'
});
exports.container.bind(mongoose_1.DBService).toSelf();
exports.container.bind(GymOwnerRepository_1.GymOwnerRepository).toSelf();
exports.container.bind(CategoryRepository_1.CategoryRepository).toSelf();
exports.container.bind(EventRepository_1.EventRepository).toSelf();
exports.container.bind(RegisterRepository_1.RegisterRepository).toSelf();
exports.container.bind(TeamRepository_1.TeamRepository).toSelf();
