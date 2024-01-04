import dotenv from 'dotenv';
const environment = process.env.NODE_ENV || 'dev';
dotenv.config({ path: `src/config/.env.${environment}` });
