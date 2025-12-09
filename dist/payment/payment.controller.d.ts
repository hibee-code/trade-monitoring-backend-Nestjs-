import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    handleWebhook(body: any, signature: string): Promise<{
        status: string;
    }>;
}
