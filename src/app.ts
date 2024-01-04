import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';

import AdminPanel from './admin-bro/index';

import './controllers/index'


import { container } from './container/index';
import { DBService } from './db/mongoose';

export class App {

    private adminPanel: AdminPanel = new AdminPanel();
    
    async setup() {

        const db = container.get(DBService)
        await db.connect()
        
        const server = new InversifyExpressServer(container);

        server.setConfig((app) => {
            app.use(express.json());
            this.adminPanel.build(app)
        });

        return server.build();
        
    }
}
