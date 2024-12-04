import { createHmac } from 'crypto';
function createWebhookSignature(secret: string, payload: string, timestamp: number): string {
    const data = `${timestamp}.${payload}`;
    const hmac = createHmac('sha256', secret);
    hmac.update(data);
    const signature = hmac.digest('hex');
    return `t=${timestamp},s=${signature}`;
}


export default function sendEvent(url:string, secret:string, payload:any) {
    payload = JSON.stringify(payload)
    const timestamp = Date.now();
    const signature = createWebhookSignature(secret, payload, timestamp);

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Signature': signature,
            'X-Timestamp': timestamp.toString(),
        },
        body: payload,
    }).then((res) => res.json());
}
