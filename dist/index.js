import express from "express";
import AdminJS from 'adminjs';
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import * as dotenv from 'dotenv';
import Event from './models/event.js';
import GymOwner from './models/gymOwner.js';
import Team from './models/team.js';
import Register from "./models/register.js";
import Category from "./models/category.js";
import "./db/mongoose.js";
import gymOwnerRouter from './routers/gymOwner.js';
import gymOwnerAuthRouter from './routers/gymOwnerAuth.js';
import teamRouter from './routers/team.js';
import registerRouter from './routers/register.js';
import eventRouter from './routers/event.js';
import categoryRouter from './routers/category.js';
dotenv.config();
AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
});
const PORT = process.env.PORT || 3000;
const start = async () => {
    const app = express();
    app.use(express.json());
    app.use(gymOwnerRouter);
    app.use(gymOwnerAuthRouter);
    app.use(teamRouter);
    app.use(registerRouter);
    app.use(eventRouter);
    app.use(categoryRouter);
    const adminOptions = {
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
    };
    const admin = new AdminJS(adminOptions);
    const adminRouter = AdminJSExpress.buildRouter(admin);
    app.use(admin.options.rootPath, adminRouter);
    app.listen(PORT, () => {
        console.log(`Server is up on http://localhost:${PORT}${admin.options.rootPath}`);
    });
};
start();
//# sourceMappingURL=index.js.map