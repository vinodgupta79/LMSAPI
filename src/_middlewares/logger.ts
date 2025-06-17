import { createLogger, transports, format } from "winston";
//import CustomTransport from '../_services/logService'



const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};

// const logger = createLogger({
//     format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), format.json()),
//     transports: [
//         new transports.Console({}),
//         new CustomTransport({})],
//     //  exceptionHandlers: [new transports.File({ filename: "exceptions.log", handleExceptions: true })],
//     //   rejectionHandlers: [new transports.File({ filename: "rejections.log", handleRejections: true })],
//     exitOnError: false
// });

const logger = {}
// logger.on('finish', function (info) {
//     console.log('logging is finished')
//     console.log(info)
// });

export default logger;
