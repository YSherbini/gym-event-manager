import Event from '../models/event.js'
import GymOwner from '../models/gymOwner.js'
import Team from '../models/team.js'
import Register from "../models/register.js";
import Category from "../models/category.js";

import { Application } from 'express';

import AdminJS from 'adminjs'
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";

AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
})

export default class AdminPanel {

    private admin = new AdminJS({
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

    private adminRouter = AdminJSExpress.buildRouter(this.admin)

    public build(app: Application): void {
        app.use(this.admin.options.rootPath, this.adminRouter);
    }
    

}