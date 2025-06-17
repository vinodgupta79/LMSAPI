import admin from 'firebase-admin';
import secrate from '../../fbPrivateKey.json';

let serviceAccount: any = secrate;


export function init() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}