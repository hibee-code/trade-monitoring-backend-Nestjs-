import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment } from './entities/payment.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class PaymentService {
    private paymentRepository;
    private configService;
    private eventEmitter;
    private readonly logger;
    private readonly secretKey;
    constructor(paymentRepository: Repository<Payment>, configService: ConfigService, eventEmitter: EventEmitter2);
    verifyWebhookSignature(signature: string, payload: any): boolean;
    processWebhook(event: any): Promise<void>;
}
