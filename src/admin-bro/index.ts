import Event from '../models/event'
import GymOwner from '../models/gymOwner'
import Team from '../models/team'
import Register from "../models/register";
import Category from "../models/category";

import { Application } from 'express';

const AdminBro = require('admin-bro');
const AdminBroExpressjs = require('admin-bro-expressjs');

AdminBro.registerAdapter(require('@admin-bro/mongoose'))

export default class AdminPanel {

    private admin = new AdminBro({
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

    private adminRouter = AdminBroExpressjs.buildRouter(this.admin)

    public build(app: Application): void {
        app.use(this.admin.options.rootPath, this.adminRouter);
    }
    

}