import mongoose from 'mongoose';
import 'dotenv/config';
import { injectable } from 'inversify';

@injectable()
export class DBService {
    async connect() {
        const { MONGODB_URL } = process.env;
        mongoose.connect(`mongodb://${MONGODB_URL}`, {
            useNewUrlParser: true,
            useCreateIndex: true,
        });
    }
}
