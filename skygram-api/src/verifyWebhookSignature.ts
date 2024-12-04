import { createHmac } from 'crypto';
export default function verifyWebhookSignature({
    secret,body,signature,timestamp
}:{
    secret:string,
    body:string,
    signature:string,
    timestamp:string
}): boolean {

    const data = `${timestamp}.${body}`;
    const hmac = createHmac('sha256', secret);
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');
    const expectedSignatureHeader = `t=${timestamp},s=${expectedSignature}`;
    return signature === expectedSignatureHeader;
  }
