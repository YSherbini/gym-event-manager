import Event from '../models/event.js';
import GymOwner from '../models/gymOwner.js';
import Team from '../models/team.js';
import Register from "../models/register.js";
import Category from "../models/category.js";
import AdminJS from 'adminjs';
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
});
export default class AdminPanel {
    admin = new AdminJS({
        resources: [
            Event,
            Team,
            Register,
            Category,
            {
                resource: GymOwner,
                options: {
                    properties: { tokens: { isVisible: false } }
                }
            }
        ]
    });
    adminRouter = AdminJSExpress.buildRouter(this.admin);
    build(app) {
        app.use(this.admin.options.rootPath, this.adminRouter);
    }
}
//# sourceMappingURL=index.js.map