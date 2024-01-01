import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import AdminPanel from './adminjs/index.js';
import { container } from './container/index.js';
import { DBService } from './db/mongoose.js';
export class App {
    adminPanel = new AdminPanel();
    async setup() {
        const { PORT } = process.env;
        const db = container.get(DBService);
        await db.connect();
        const server = new InversifyExpressServer(container);
        server.setConfig((app) => {
            app.use(express.json());
            this.adminPanel.build(app);
        });
        const app = server.build();
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        });
    }
}
//# sourceMappingURL=app.js.map