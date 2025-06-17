import * as dotenv from 'dotenv';

// dotenv.config({
//     path: '${__dirname}/../.env'  //-----------to provide specific .env file located in other place
// });

dotenv.config();

export default {
    port: Number(process.env.port),
    db_host: String(process.env.db_host),
    db_port: Number(process.env.db_port),
    db_name: String(process.env.db_name),
    db_user: String(process.env.db_user),
    db_password: String(process.env.db_password),
    service_name: String(process.env.service_name),
    psd_salt: Number(process.env.psd_salt),
    node_env: String(process.env.node_env),
    email_service: String(process.env.email_service),
    email_host: String(process.env.email_host),
    email_user: String(process.env.email_user),
    email_pass: String(process.env.email_pass),
    email_port: Number(process.env.email_port),
    email_secure: Boolean(process.env.email_secure),

    secret: String(process.env.secret),
    alg: String(process.env.alg || 'HS256'),
    iss: String(process.env.iss),
    id: String(process.env.id),
    aud: Array(process.env.aud),
    sub: String(process.env.sub),
    jwtWebExpiresIn: Number(parseInt(process.env.jwtWebExpiresIn || '0')),     //-------------- 1 hour
    jwtWebRefreshExpiresIn: Number(parseInt(process.env.jwtWebRefreshExpiresIn || '0')),  //    --------------  24 hours
    jwtMobExpiresIn: Number(parseInt(process.env.jwtMobExpiresIn || '0')),     //-------------- 24 hours
    jwtMobRefreshExpiresIn: Number(parseInt(process.env.jwtMobRefreshExpiresIn || '0'))     //-------------- 7 days
}