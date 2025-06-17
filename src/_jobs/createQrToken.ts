import { sign, SignOptions, TokenExpiredError, verify } from 'jsonwebtoken';
import config from '../_configs/auth'
import bcrypt from 'bcryptjs';
const randomstring = require("randomstring");


const payload: any = {
    name: 'vikash kumar',
    userId: 'vkumar',
    role_name: 'admin',
    access_types: [
        'getTeams',
        'addTeams',
        'updateTeams',
        'deleteTeams'
    ]
};

const signInOptions: any = {
    algorithm: config.alg,
    jwtid: config.id,
    audience: config.aud,
    issuer: config.iss,
    subject: config.sub,
    expiresIn: '1h'
}


const generateQrToken_jwt = async () => {
    let token = sign(payload, config.secret, signInOptions);
    return token;
};

const generateQrToken_bcryptjs = async () => {
    var tokenKey = randomstring.generate(150);
    const saltRounds = 10;

    let hashedToken = await new Promise((resolve, reject) => {
        bcrypt.hash(tokenKey, saltRounds, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })

    return hashedToken
};

const generateQrToken = async () => {
    let ind: number = 0;
    var randomString = randomstring.generate(150);
    // var theRandomNumber = Math.floor(Math.random() * 10) + 1
    ind = Math.floor(Math.random() * 149);
    var randomStringArr = randomString.split('');
    (ind % 2 == 0) ? randomStringArr.splice(ind, 1, '++') : randomStringArr.splice(ind, 1, '+');
    ind = Math.floor(Math.random() * 149);
    (ind % 2 == 0) ? randomStringArr.splice(ind, 1, '==') : randomStringArr.splice(ind, 1, '=');
    ind = Math.floor(Math.random() * 149);
    (ind % 2 == 0) ? randomStringArr.splice(ind, 1, '--') : randomStringArr.splice(ind, 1, '-');
    ind = Math.floor(Math.random() * 149);
    randomStringArr.splice(ind, 1, '?');
    ind = Math.floor(Math.random() * 149);
    randomStringArr.splice(ind, 1, '.');
    ind = Math.floor(Math.random() * 149);
    randomStringArr.splice(ind, 1, ',');
    ind = Math.floor(Math.random() * 149);
    (ind % 2 == 0) ? randomStringArr.splice(ind, 1, '++') : randomStringArr.splice(ind, 1, '+');
    ind = Math.floor(Math.random() * 149);
    (ind % 2 == 0) ? randomStringArr.splice(ind, 1, '==') : randomStringArr.splice(ind, 1, '=');
    randomString = randomStringArr.join('');
    return randomString;
};


const generateFormId = async () => {
    let ind: number = 0;
    var randomString = randomstring.generate(50);
    // var theRandomNumber = Math.floor(Math.random() * 10) + 1
    ind = Math.floor(Math.random() * 49);
    var randomStringArr = randomString.split('');

    ind = Math.floor(Math.random() * 49);
    randomStringArr.splice(ind, 1, '?');
    ind = Math.floor(Math.random() * 49);
    randomStringArr.splice(ind, 1, '.');
    ind = Math.floor(Math.random() * 49);
    randomStringArr.splice(ind, 1, ',');
    ind = Math.floor(Math.random() * 49);
    randomStringArr.splice(ind, 1, '+');
    ind = Math.floor(Math.random() * 49);
    randomStringArr.splice(ind, 1, '-');
    randomString = randomStringArr.join('');
    return randomString;
};





export const jobs = {
    generateQrToken,
    generateFormId
}
