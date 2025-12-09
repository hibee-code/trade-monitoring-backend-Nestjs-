import { Controller, Post, Body, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('webhook')
    async handleWebhook(
        @Body() body: any,
        @Headers('x-paystack-signature') signature: string,
    ) {
        if (!signature) {
            throw new HttpException('Missing signature', HttpStatus.BAD_REQUEST);
        }

        const isValid = this.paymentService.verifyWebhookSignature(signature, body);
        if (!isValid) {
            throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
        }

        await this.paymentService.processWebhook(body);
        return { status: 'success' };
    }
}
