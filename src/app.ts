import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { createServer } from "http";
import { Server } from "socket.io";
import config from './_configs/default';
import * as dotenv from "dotenv";
import { QrToken } from './_models/qrToken';
import { generateToken } from './_middlewares/jwt';


//------------------------------------------------------api Server
import app from './_services/_app';
import xContentTypeOptions from 'helmet/dist/types/middlewares/x-content-type-options';
const httpServer = createServer(app);
const port = config.port;
dotenv.config();




// if (config.node_env !== 'production') {
//     console.log('JWT', generateToken());
// }
//------------------------------------------------------end api Server



httpServer.listen(port, () => {
    console.info(`server running on ${port}`)

});

