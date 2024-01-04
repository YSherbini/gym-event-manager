"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = __importDefault(require("../models/event"));
const gymOwner_1 = __importDefault(require("../models/gymOwner"));
const team_1 = __importDefault(require("../models/team"));
const register_1 = __importDefault(require("../models/register"));
const category_1 = __importDefault(require("../models/category"));
const AdminBro = require('admin-bro');
const AdminBroExpressjs = require('admin-bro-expressjs');
AdminBro.registerAdapter(require('@admin-bro/mongoose'));
class AdminPanel {
    constructor() {
        this.admin = new AdminBro({
            resources: [
                event_1.default,
                team_1.default,
                register_1.default,
                category_1.default,
                {
                    resource: gymOwner_1.default,
                    options: {
                        properties: { tokens: { isVisible: false } }
                    }
                }
            ]
        });
        this.adminRouter = AdminBroExpressjs.buildRouter(this.admin);
    }
    build(app) {
        app.use(this.admin.options.rootPath, this.adminRouter);
    }
}
exports.default = AdminPanel;
