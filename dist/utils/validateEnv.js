import { cleanEnv, str, port } from 'envalid';
function validateEnv() {
    cleanEnv(process.env, {
        MONGODB_URL: str(),
        PORT: port(),
        JWT_SECRET: str()
    });
}
export default validateEnv;
//# sourceMappingURL=validateEnv.js.map