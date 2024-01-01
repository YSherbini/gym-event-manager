"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_js_1 = __importDefault(require("../models/event.js"));
const gymOwner_js_1 = __importDefault(require("../models/gymOwner.js"));
const team_js_1 = __importDefault(require("../models/team.js"));
const register_js_1 = __importDefault(require("../models/register.js"));
const category_js_1 = __importDefault(require("../models/category.js"));
const adminjs_1 = __importDefault(require("adminjs"));
const express_1 = __importDefault(require("@adminjs/express"));
const AdminJSMongoose = __importStar(require("@adminjs/mongoose"));
adminjs_1.default.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
});
class AdminPanel {
    constructor() {
        this.admin = new adminjs_1.default({
            resources: [
                event_js_1.default,
                team_js_1.default,
                register_js_1.default,
                category_js_1.default,
                {
                    resource: gymOwner_js_1.default,
                    options: {
                        properties: { tokens: { isVisible: false } }
                    }
                }
            ]
        });
        this.adminRouter = express_1.default.buildRouter(this.admin);
    }
    build(app) {
        app.use(this.admin.options.rootPath, this.adminRouter);
    }
}
exports.default = AdminPanel;
//# sourceMappingURL=index.js.map