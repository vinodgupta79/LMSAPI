import { getMessaging } from 'firebase-admin/messaging';


export async function sendNotification(fcmToken: string, message: string, type: string): Promise<any> {

    // console.log("fcm", fcmToken)
    // // debugger
    // console.log(message)
    const mess = {
        title: type,
        body: JSON.stringify(message)
    }
    try {
        const res = await getMessaging().send({
            token: fcmToken,
            notification: mess
        });

        // console.log(res)
        return res;

    } catch (err) {
        console.log(`there is error while sending notification ${err}`)
        throw err;
    }
}

module.exports = {
    sendNotification
};