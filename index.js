import express, { json, urlencoded } from 'express';
import router from './routes.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

//making express app
const app = express();

//adding middlewares for parsing json and urlencoded data in req body
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

//defining __dirname as it is not defined in ES Modules
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//setting view engine to ejs for rendering html
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//connecting to db
dotenv.config(); //for using env variables
const dbConnectURI = process.env.MONGODB_URI;
async function dbConnect() {
    try {
        await mongoose.connect(dbConnectURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB connected');
    } catch (err) {
        console.log('DB connection error: ', err);
    }
}
dbConnect();

//using router middleware
app.use(router);

app.listen(4000, () => {
    console.log('server listening to port 4000');
});