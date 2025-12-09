import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Trade, TradeStatus } from '../trade/entities/trade.entity';
import { Payment } from '../payment/entities/payment.entity';
import { AuditService } from '../audit/audit.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class DecisionService {
    private readonly logger = new Logger(DecisionService.name);

    constructor(
        @InjectRepository(Trade)
        private tradeRepository: Repository<Trade>,
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        private notificationService: NotificationService,
        private auditService: AuditService,
    ) { }

    @OnEvent('trade.created')
    async handleTradeCreated(trade: Trade) {
        this.logger.log(`Checking payments for new trade: ${trade.orderId}`);
        await this.matchTrade(trade);
    }

    @OnEvent('payment.received')
    async handlePaymentReceived(payment: Payment) {
        this.logger.log(`Checking trades for new payment: ${payment.reference}`);
        // Find trade that matches this payment
        // Logic: Same amount, same currency?
        // This depends on the business logic. Let's assume exact amount match + pending status.
        // In real world, might key off a reference code in matching description.

        // For now, let's look for a trade with exact amount and status CREATED.
        const trade = await this.tradeRepository.findOne({
            where: {
                amount: payment.amount,
                // currency: payment.currency, // Assuming currency matches
                status: TradeStatus.CREATED,
                isPaymentVerified: false,
            },
        });

        if (trade) {
            await this.confirmMatch(trade, payment);
        } else {
            this.logger.log(`No matching trade found for payment ${payment.reference}`);
        }
    }

    async matchTrade(trade: Trade) {
        // Look for orphan payments
        const payment = await this.paymentRepository.findOne({
            where: {
                amount: trade.amount,
                status: 'success',
                matchedTradeId: IsNull(),
            }
        });
        // Simple exact amount match for now.
        // Logic needs to be more robust (e.g. time window).

        if (payment) {
            await this.confirmMatch(trade, payment);
        }
    }

    async confirmMatch(trade: Trade, payment: Payment) {
        this.logger.log(`MATCH FOUND: Trade ${trade.orderId} matches Payment ${payment.reference}`);

        trade.isPaymentVerified = true;
        trade.status = TradeStatus.PAID; // Or similar
        payment.matchedTradeId = trade.orderId;

        await this.tradeRepository.save(trade);
        await this.paymentRepository.save(payment);

        await this.auditService.log('MATCH_SUCCESS', 'TRADE', trade.orderId, { paymentReference: payment.reference });
        await this.notificationService.sendAlert(`✅ Payment Verified for Trade ${trade.orderNo}\nAmount: ${trade.amount}\nBuyer: ${trade.buyerName}`);
    }
}
