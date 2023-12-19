import express from "express";
import AdminJS from 'adminjs'
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import 'dotenv/config';
import Event from './models/event.mjs'
import GymOwner from './models/gymOwner.mjs'
import Team from './models/team.mjs'
import register from "./models/register.mjs";
import Category from "./models/category.mjs";
import "./db/mongoose.mjs";
import gymOwnerRouter from './routers/gymOwner.mjs';
import teamRouter from './routers/team.mjs'
import registerRouter from './routers/register.mjs'
import eventRouter from './routers/event.mjs'
import categoryRouter from './routers/category.mjs'

AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
})

const PORT = process.env.PORT || 3000;

const start = async () => {
    const app = express();

    app.use(express.json());
    app.use(gymOwnerRouter)
    app.use(teamRouter)
    app.use(registerRouter)
    app.use(eventRouter)
    app.use(categoryRouter)

    const adminOptions = {
        resources: [
            Event,
            Team,
            register,
            Category,
            {
                resource: GymOwner,
                options: {
                    properties: { tokens: { isVisible: false } }
                }
            }
        ]
    }

    const admin = new AdminJS(adminOptions)

    const adminRouter = AdminJSExpress.buildRouter(admin)
    app.use(admin.options.rootPath, adminRouter)

    app.listen(PORT, () => {
        console.log(`Server is up on http://localhost:${PORT}${admin.options.rootPath}`);
    });
}

start()