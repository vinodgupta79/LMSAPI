import nodemailer from 'nodemailer';
import config from '../_configs/default';
import Email from '../_models/email';

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'consultitbackup@gmail.com', // Your Gmail email address
        pass: 'consultit'   // Your Gmail password (consider using an application-specific password for security)
    }
});

// Email content
const mailOptions = {
    from: 'vinodgupta79@gmail.com',
    to: 'vinodgupta79@gmail.com',
    subject: 'Node.js Email Example',
    text: 'Hello, this is a test email sent from Node.js!'
};

// Send the email
transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});
