import { config as conf } from "dotenv";

conf();

const _config = {
    port:process.env.PORT,
    databaseurl:process.env.MONGO_CONNECTION_STRING,
    jwtSecret:process.env.JWT_SECRET,
};

export const config=Object.freeze(_config);