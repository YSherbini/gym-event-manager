import mongoose from 'mongoose';
import 'dotenv/config';
const { MONGODB_URL } = process.env;
mongoose.connect(`mongodb://${MONGODB_URL}`, {
    useNewUrlParser: true,
    useCreateIndex: true
});
//# sourceMappingURL=mongoose.js.map