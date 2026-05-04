import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class MomoService {
  private readonly partnerCode = 'MOMO';
  private readonly accessKey = 'F8BBA842ECF85';
  private readonly secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  private readonly apiEndpoint = 'https://test-payment.momo.vn/v2/gateway/api/create';

  // IPN URL is the webhook endpoint
  private readonly ipnUrl = process.env.MOMO_IPN_URL || 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b'; // Use webhook.site for initial testing if needed

  async createPaymentQR(orderId: string, amount: number, orderInfo: string, extraData: string = "") {
    try {
      const requestId = orderId;
      const redirectUrl = process.env.MOMO_REDIRECT_URL || "http://localhost:3000/dashboard/student";
      const requestType = "captureWallet";
      
      // Ensure amount is an integer (MoMo requirement for VND)
      const intAmount = Math.round(amount);

      // Signature order: accessKey, amount, extraData, ipnUrl, orderId, orderInfo, partnerCode, redirectUrl, requestId, requestType
      const rawSignature = `accessKey=${this.accessKey}&amount=${intAmount}&extraData=${extraData}&ipnUrl=${this.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
      
      console.log('--- MoMo Signature Generation ---');
      console.log('Raw Signature:', rawSignature);

      const signature = crypto.createHmac('sha256', this.secretKey)
        .update(rawSignature)
        .digest('hex');
      
      const body = {
        partnerCode: this.partnerCode,
        requestId,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl: this.ipnUrl,
        amount: intAmount,
        extraData,
        requestType,
        signature,
        lang: 'vi'
      };

      console.log('--- MoMo Request Payload ---');
      console.log(JSON.stringify(body, null, 2));

      const response = await axios.post(this.apiEndpoint, body);
      
      console.log('--- MoMo Response ---');
      console.log(JSON.stringify(response.data, null, 2));
      
      return response.data; // Contains payUrl
    } catch (error: any) {
      console.error('--- MoMo Error ---');
      console.error(error?.response?.data || error);
      throw new InternalServerErrorException('Failed to create payment via MoMo');
    }
  }

  verifySignature(momoData: any): boolean {
    const { 
      partnerCode, orderId, requestId, amount, orderInfo, 
      orderType, transId, resultCode, message, payType, 
      responseTime, extraData, signature 
    } = momoData;

    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    
    const expectedSignature = crypto.createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const isValid = signature === expectedSignature;
    if (!isValid) {
      console.error('MoMo Invalid Signature detected!');
      console.error('Received Signature:', signature);
      console.error('Expected Signature:', expectedSignature);
      console.error('Raw Signature context:', rawSignature);
    }

    return isValid;
  }
}
