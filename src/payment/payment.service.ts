import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment } from './entities/payment.entity';
import * as crypto from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);
    private readonly secretKey: string;

    constructor(
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        private configService: ConfigService,
        private eventEmitter: EventEmitter2,
    ) {
        this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY') || '';
    }

    verifyWebhookSignature(signature: string, payload: any): boolean {
        const hash = crypto
            .createHmac('sha512', this.secretKey)
            .update(JSON.stringify(payload))
            .digest('hex');
        return hash === signature;
    }

    async processWebhook(event: any) {
        this.logger.log(`Processing webhook event: ${event.event}`);
        if (event.event === 'charge.success') {
            const data = event.data;
            const payment = this.paymentRepository.create({
                reference: data.reference,
                amount: data.amount / 100, // Paystack amount is in kobo/cents
                currency: data.currency,
                payerName: data.customer?.first_name + ' ' + data.customer?.last_name || 'Unknown',
                payerEmail: data.customer?.email,
                status: data.status,
                metadata: data.metadata,
                receivedAt: new Date(data.paid_at),
            });

            try {
                await this.paymentRepository.save(payment);
                this.logger.log(`Payment saved: ${payment.reference}`);
                this.eventEmitter.emit('payment.received', payment);
                // Trigger matching logic here (Trade Matching Service)
            } catch (error) {
                if (error.code === '23505') { // Unique constraint violation (duplicate webhook)
                    this.logger.warn(`Duplicate payment reference: ${data.reference}`);
                } else {
                    this.logger.error('Error saving payment', error);
                    throw error;
                }
            }
        }
    }
}
