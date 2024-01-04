import './config/index'
import 'reflect-metadata';

import { App } from './app';

export async function bootstrap() {

    const { PORT } = process.env;

    const app = await new App().setup()

    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });

}
bootstrap();
