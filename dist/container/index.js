"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const mongoose_js_1 = require("../db/mongoose.js");
const inversify_1 = require("inversify");
const CategoryRepository_js_1 = require("../repositories/CategoryRepository.js");
const GymOwnerRepository_js_1 = require("../repositories/GymOwnerRepository.js");
const EventRepository_js_1 = require("../repositories/EventRepository.js");
const RegisterRepository_js_1 = require("../repositories/RegisterRepository.js");
const TeamRepository_js_1 = require("../repositories/TeamRepository.js");
exports.container = new inversify_1.Container({
    defaultScope: 'Singleton'
});
exports.container.bind(mongoose_js_1.DBService).toSelf();
exports.container.bind(GymOwnerRepository_js_1.GymOwnerRepository).toSelf();
exports.container.bind(CategoryRepository_js_1.CategoryRepository).toSelf();
exports.container.bind(EventRepository_js_1.EventRepository).toSelf();
exports.container.bind(RegisterRepository_js_1.RegisterRepository).toSelf();
exports.container.bind(TeamRepository_js_1.TeamRepository).toSelf();
//# sourceMappingURL=index.js.map