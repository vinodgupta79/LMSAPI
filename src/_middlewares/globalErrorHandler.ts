import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../_dbs/oracle/oracleConnection';
import { QueryTypes } from 'sequelize';
import { AppError } from '../helpers/customError'; // Assuming this is your custom error class

// Function to insert error logs into the database
const logErrorToDatabase = async (log: { method: string; url: string; status: number; message: string }) => {
    try {
        console.log("Inserting log into database:", log);
        await sequelize.query(
            `INSERT INTO error_logs (method, url, status, message,environment,error_type) VALUES (:method, :url, :status, :message,:environment,
            :error_type)`,
            {
                replacements: log,
                type: QueryTypes.INSERT,
            }
        );
    } catch (error) {
        console.error('Error saving log to database:', error);
    }
};

// Global error handler that sends response and logs errors to the database
export const globalErrorHandler = (
    err: AppError | Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let status = 0;
    let message = err.message;

    // Handle known errors
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        status = err.status;
        message = err.message;

    }
    // Log the error to the database
    const log = {
        method: req.method,
        url: req.url,
        status: statusCode,
        message: message,
        environment: process.env.NODE_ENV,
        error_type: err.name
    };

    logErrorToDatabase(log); // Insert error log into the database

    // Send the response to the client
    res.status(statusCode).json({
        status,
        message,
    });
};
