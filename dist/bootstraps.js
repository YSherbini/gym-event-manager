import 'dotenv/config';
import 'reflect-metadata';
import './controllers/index.js';
import { App } from './app.js';
export async function bootstrap() {
    new App().setup();
}
bootstrap();
//# sourceMappingURL=bootstraps.js.map