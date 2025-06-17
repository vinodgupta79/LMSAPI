import express, { Application, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import createHttpError from 'http-errors';
import fs = require('fs');
import cors from "cors";
import helmet from "helmet";
import routes from '../routes/routeIndex';
import response from '../_middlewares/response';
import morganLogger from '../_configs/morgan';
import * as firebaseApp from '../_dbs/firebase/fbMessage';
import path from 'path';
import dotenv from "dotenv"
import bodyParser from "body-parser";
import { globalErrorHandler } from '../_middlewares/globalErrorHandler';
dotenv.config();

//------------------------------------------------------api Server
const app: Application = express();
app.use(helmet());
app.use(cors());
//app.use(express.text());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));


var allowedOrigins = ['http://103.171.45.231:8080', 'http://103.171.45.88:8080', 'http://127.0.0.1:3000', 'http://13.234.28.228:8000', 'http://52.66.173.135:3000', 'http://52.66.173.135:3001', 'http://52.66.173.135:3002', 'http://localhost:3000', 'https://www.remitwise.in', 'https://test.remitwise.in'];
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));


firebaseApp.init();

/** Routes */
app.use('', routes);
// Global error handler
app.use(globalErrorHandler);
// /** Error handling */
app.use((req, res) => {
    // console.log('---------------------------logging Not Found');
    // console.log(req.url);
    // console.log(req.body)
    throw createHttpError(404, "Not Found");
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    // console.log(err.message, err.statusCode);
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.statusCode || 500).json(response.error(err.message))


}
//C:\vinod\CipherPay\api\uploads\BPCL
//// debugger
// console.log(path.join(__dirname, '../../uploads/bpcl'));
// console.log(path.join(__dirname, 'public'));
//app.use('/static', express.static(path.join(__dirname, 'public')));
//app.use('/static', express.static(path.join(__dirname, 'public')));


app.use('/cropimage', express.static(path.join(__dirname, '../../uploads/bpcl')))
//app.use('/a', express.static(path.join(__dirname, 'b')));

app.use(errorHandler);
//app.use(morganLogger);
export default app;
