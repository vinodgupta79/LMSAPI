import axios from 'axios';
import { createHmac, randomBytes, createCipheriv, pbkdf2Sync, publicEncrypt, constants, createDecipheriv, privateDecrypt } from 'crypto';

import { readFileSync } from 'fs';
import * as path from 'path';

console.log('------------')
console.log(path.join(__dirname, '../reference'))

export class CpPayout {
    mainurl: string;
    key: string;
    partnerid: string;
    headerJson: any;
    publicKey: string;
    aesIv: string;
    aesKey: string;
    publicKeyHeader: string;
    partnerToken: string;
    // const publicKey = fs.readFileSync('body_public_key.pem', 'utf8');
    //const publicKeyheader = fs.readFileSync('header_public_key.pem', 'utf8');
    constructor() {
        this.mainurl = 'https://uatapi.cipherpay.co.in/api/v2/';
        this.key = 'Q1AwMDM2NzokMnkkMTIkb3JXVER1OHFORkFzMFlSdzdMWGZ3ZWhXT3UxNUdsUzNuQ0s4THZYaWNsWmdtczFRVFFaQ3E='; // token
        this.partnerid = '20221061'; // 2022XXXX
        this.headerJson = '{"partnerId": "CP00367", "headerToken": "7R3wHMKXvP-VFYPUIIivS-HwDAP-LZtcto9ABxgy6tv"}'; // header json
        this.publicKey = readFileSync(path.join(__dirname, '../../referance/body_public_key.pem'), 'utf8');;
        this.aesKey = '';
        this.aesIv = '';
        this.publicKeyHeader = readFileSync(path.join(__dirname, '../../referance/header_public_key.pem'), 'utf8');

        // this.publicKeyHeader = readFileSync(__dirname)
        this.partnerToken = 'JDJ5JDEyJG9yV1REdThxTkZBczBZUnc3TFhmd2VoV091MTVHbFMzbkNLOEx2WGljbFpnbXMxUVRRWkNxQ1AwMDM2Nw=='; // authorisedKey
    }

    async status(reqData: any) {
        const request = {
            method: 'POST',
            url: 'pay/check-status',
            parameter: reqData,
        };
        return this.finalResponse(await this.hit(request));
    }

    async balance() {
        const request = {
            method: 'POST',
            url: 'pay/balance-enquiry',
            parameter: '',
        };
        let response = this.finalResponse(await this.hit(request))

        return response;
    }

    async singlepayout(reqData: any) {
        const request = {
            method: 'POST',
            url: 'pay/singlepayout',
            parameter: reqData,
        };
        //	console.log("finalResponse returndata:",this.finalResponse(await this.hit(request)))

        return this.finalResponse(await this.hit(request));
    }
    async verifyaccount(reqData: any) {
        const request = {
            method: 'POST',
            url: 'pay/verify-account',
            parameter: reqData,
        };
        //	console.log("finalResponse returndata:",this.finalResponse(await this.hit(request)))

        return this.finalResponse(await this.hit(request));
    }

    async hit(reqData: any) {
        // console.log("hit reqData:",reqData)
        const url = this.mainurl + reqData.url;
        console.log(url);
        const num = Date.now();
        reqData.jwt = this.getJwtToken();

        this.writeLog(`REQUEST${num}`, reqData);

        let parameter = '';
        if (reqData.parameter !== '') {
            parameter = JSON.stringify(reqData.parameter);
        }

        const info = this.finalRequest(parameter);
        // console.log("info:",reqData)
        try {
            let body: any = {
                method: reqData.method,
                url: url,
                headers: {
                    'Token': reqData.jwt,
                    'Authorisedkey': this.partnerToken,
                    'Auth': info.Auth,
                    'Key': info.Key,
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    'User-Agent': 'axios', // You can change this to the appropriate user agent
                },
            }
            body.data = null;
            if (info.payload != null) {
                body.data = JSON.stringify(info.payload);
            }
            //	console.log("----------------",body)

            const response = await axios(body);
            this.writeLog(`RESPONSE${num}`, response.data);
            //  console.log("*****finalResponse:",response.data)
            return response.data;
        } catch (error: any) {
            const resp: any = error.response.data;
            this.writeLog(`RESPONSE${num}`, error.response.data);

            return resp;
        }
    }

    getJwtToken() {
        const reqId = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
        const now = new Date();
        now.setUTCHours(now.getUTCHours() + 5); // Add 5 hours for Asia/Kolkata timezone
        now.setUTCMinutes(now.getUTCMinutes() + 30); // Add an additional 30 minutes

        // Format the timestamp as "YYYY-MM-DD HH:mm:ss"
        const timestamp = now.toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/Z$/, '');


        const tokendata = {
            // timezone: 'Asia/Kolkata',

            timestamp: timestamp,
            partnerId: this.partnerid,
            reqId: reqId,
        };
        const header = {
            alg: 'HS256',
            typ: 'JWT',
        };
        const secret = this.key;
        return this.generateJwt(header, tokendata, secret);
    }

    generateJwt(header: any, payload: any, secret: any) {
        const headerEncoded = this.base64UrlEncode(JSON.stringify(header));
        const payloadEncoded = this.base64UrlEncode(JSON.stringify(payload));

        // Concatenate the header and payload with a period ('.')
        const tokenData = `${headerEncoded}.${payloadEncoded}`;

        // Create the signature using HMAC-SHA256
        const signature = createHmac('sha256', secret)
            .update(tokenData)
            .digest('base64');

        // Concatenate the tokenData and signature with a period ('.')
        const jwtToken = `${tokenData}.${signature}`;
        console.log(jwtToken)
        return jwtToken;
    }

    base64UrlEncode(data: any) {
        const urlSafeData = Buffer.from(data, 'utf8')
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        return urlSafeData;
    }

    writeLog(type: any, req: any) {
        // Implement your logging logic here
    }

    finalRequest(parameters = '') {
        // console.log("finalRequest parameters:",parameters)
        const salt = randomBytes(8).toString('hex');
        const data = this.generateAesKey(salt);
        const key = data[0];
        const iv = data[1];
        const cipher = 'aes-128-cbc';

        let encrypted: any = '';
        if (parameters !== '') {

            encrypted = createCipheriv(cipher, key, iv);
            const encryptedData = Buffer.concat([encrypted.update(JSON.stringify(parameters), 'utf8'), encrypted.final()]);
            encrypted = encryptedData.toString('base64');
        }

        const encryptedSalt = this.rsaEncrypt(salt, this.publicKey);
        const encryptedHeader = this.rsaEncrypt(this.headerJson, this.publicKeyHeader);

        const request = {
            Auth: encryptedHeader,
            Key: encryptedSalt,
            payload: parameters ? { requestData: encrypted } : null,
        };

        return request;
    }

    generateAesKey(salt: any) {
        const passphrase = 'CipherPay API Payout';
        const iterationCount = 10000;
        const keySize = 128;
        const hashAlgorithm = 'sha1';
        const key: any = pbkdf2Sync(passphrase, Buffer.from(salt, 'hex'), iterationCount, keySize / 8, hashAlgorithm);
        this.aesKey = key;
        this.aesIv = salt;
        return [this.aesKey, this.aesIv];
    }

    rsaEncrypt(data: any, publicKey: any) {
        // console.log("rsa encrypt",publicKey)
        const publicKeyBuffer = Buffer.from(publicKey, 'base64');
        const encrypted = publicEncrypt({
            key: publicKey,
            padding: constants.RSA_PKCS1_PADDING, // Use PKCS#1 padding
        }, Buffer.from(data, 'utf8'));
        // console.log(encrypted.toString('base64'));
        return encrypted.toString('base64');
    }




    response(response: any) {
        return JSON.parse(response);
    }

    finalResponse(response: any) {

        const responseData = response?.returnData;
        if (responseData == null) {
            return response
        }
        const encrypted: any = Buffer.from(responseData, 'base64');
        const decrypted = createDecipheriv('aes-128-cbc', this.aesKey, this.aesIv);
        // let decryptedData: any = decrypted.update(encrypted, 'base64', 'utf8');
        let decryptedData = decrypted.update(encrypted, 'base64', 'utf8');
        //  let decryptedData: any = decrypted.update(response, 'base64', 'utf8')
        decryptedData += decrypted.final('utf8');

        return JSON.parse(decryptedData);
    }

    consumeCallback(headerKey: any, requestData: any, privateKey: any) {
        const key = Buffer.from(headerKey, 'base64');
        const requestDataBuffer = Buffer.from(requestData, 'base64');
        const privateKeyBuffer = Buffer.from(privateKey, 'utf8');
        const salt = privateDecrypt(privateKeyBuffer, key).toString('hex');
        const aesKey = this.generateAesKey(salt)[0];
        const decipher = createDecipheriv('aes-128-cbc', aesKey, Buffer.from(salt, 'hex'));
        //let output: any = decipher.update(requestDataBuffer, 'base64', 'utf8');
        let output: any = decipher.update(headerKey, 'base64', 'utf8');
        output += decipher.final('utf8');
        return output;
    }
}