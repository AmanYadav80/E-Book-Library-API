import { config as conf } from "dotenv";

conf();

const _config = {
    port:process.env.PORT,
    databaseurl:process.env.MONGO_CONNECTION_STRING,
    jwtSecret:process.env.JWT_SECRET,
    cloudinaryCloud:process.env.CLOUDINARY_CLOUD,
    cloudinaryApiKey:process.env.CLOUDINARY_API_KEY,
    cloudinarySecret:process.env.CLOUDINARY_SECRET
};

export const config=Object.freeze(_config);