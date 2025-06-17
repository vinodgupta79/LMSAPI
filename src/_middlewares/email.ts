import nodemailer from 'nodemailer';
import config from '../_configs/default';
import Email from '../_models/email';


// const transporter = nodemailer.createTransport({
//     service: config.email_service,
//     secure: config.email_secure,
//     host: config.email_host,
//     port: config.email_port,
//     auth: {
//         user: config.email_user,
//         pass: config.email_pass
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });


const transporter = nodemailer.createTransport({
    service: 'smtp',
    host: 'smtp.rediffmailpro.com',
    port: 465,
    secure: true,
    auth: {
        user: 'wachsupport@orionsecure.co.in',
        pass: 'Wach#456!' // naturally, replace both with your real credentials or an application-specific password
    },
    tls: {
        rejectUnauthorized: false
    }
});




// const sendMail = async function (mailOptions: Email) {
//     return new Promise((resolve, reject) => {
//         transporter.sendMail(mailOptions, function (error, info) {
//             if (error) {
//                 console.log(error);
//                 resolve(false);
//             } else {
//                 console.log('Email sent: ' + info.response);
//                 resolve(true);
//             }
//         });
//     });
// }

const sendMail = async function (mailOptions: any) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                resolve(false);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        });
    });
}

export default {
    sendMail
}