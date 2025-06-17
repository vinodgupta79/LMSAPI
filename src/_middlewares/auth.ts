import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validateToken } from './../_middlewares/jwt';
import createHttpError from "http-errors";

/**
 * middleware to check whether user has access to a specific endpoint
 *
 * @param allowedAccessTypes list of allowed access types of a specific endpoint
 */
const authorize: RequestHandler = async (req, res, next) => {
    try {
        // debugger
        let jwt = req.headers.authorization;

        // verify request has token
        if (!jwt) {
            return res.status(401).json({ message: 'Token is not available' });
        }

        // remove Bearer if using Bearer Authorization mechanism
        // if (jwt.toLowerCase().startsWith('bearer')) {
        //     jwt = jwt.slice('bearer'.length).trim();
        // }

        // verify token hasn't expired yet
        const decodedToken = await validateToken(jwt);

        console.log(decodedToken)

        // const hasAccessToEndpoint = allowedAccessTypes.some(
        //     (at) => decodedToken.accessTypes.some((uat: any) => uat === at)
        // );

        // if (!hasAccessToEndpoint) {
        //     return res.status(401).json({ message: 'No enough privileges to access endpoint' });
        // }

        next();
    } catch (error: any) {
        // debugger
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Expired token' });
            return;
        }
        else {
            res.status(500).json({ message: 'Invalid token' });
            return;
        }


    }
};

export default authorize;