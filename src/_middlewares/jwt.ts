import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';
import config from './../_configs/default';

//import * as fs from 'fs';
import fs from 'fs';
import * as path from 'path';

/**
 * generates JWT used for local testing
 */
export function generateToken(userDetail: any) {
    // information to be encoded in the JWT
    let payload = {
        userId: userDetail.userId
    };
    // read private key value
    //  console.log('-------------------dir name------------')
    // console.log(path.join(__dirname, './../../'))
    // const privateKey = fs.readFileSync(path.join(__dirname, './../../private.key'));
    // console.log(privateKey)

    let secretKey = config.secret;

    let signInOptions: SignOptions = {

        // RS256 uses a public/private key pair. The API provides the private key
        // to generate the JWT. The client gets a public key to validate the
        // signature
        // RS256 is an asymmetric encryption method.This differs from a symmetric scheme in that rather than using a single secret key, a pair of seperate keys are used to encrypt and decrypt the data.
        // algorithm: 'RS256',

        //         HS256
        // HS256 is a symmetric signing method.This means that the same secret key is used to both create and verify the signature.
        algorithm: 'HS256',
        expiresIn: '1h'
    };

    // generate JWT
    return sign(payload, secretKey, signInOptions);
};



export function validateToken(token: string): Promise<any> {
    // debugger
    let secretKey = config.secret;

    let verifyOptions: VerifyOptions = {
        algorithms: ['HS256'],
    };



    return new Promise((resolve, reject) => {
        verify(token, secretKey, (error, decoded: any) => {
            if (error) return reject(error);

            resolve(decoded);
        })
    });
    /*
        return new Promise((resolve, reject) => {
            verify(token, secretKey, verifyOptions, (error, decoded: any) => {
                if (error) return reject(error);
    
                resolve(decoded);
            })
        });*/
}