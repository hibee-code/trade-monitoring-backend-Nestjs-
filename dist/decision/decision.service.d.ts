import { Repository } from 'typeorm';
import { Trade } from '../trade/entities/trade.entity';
import { Payment } from '../payment/entities/payment.entity';
import { AuditService } from '../audit/audit.service';
import { NotificationService } from '../notification/notification.service';
export declare class DecisionService {
    private tradeRepository;
    private paymentRepository;
    private notificationService;
    private auditService;
    private readonly logger;
    constructor(tradeRepository: Repository<Trade>, paymentRepository: Repository<Payment>, notificationService: NotificationService, auditService: AuditService);
    handleTradeCreated(trade: Trade): Promise<void>;
    handlePaymentReceived(payment: Payment): Promise<void>;
    matchTrade(trade: Trade): Promise<void>;
    confirmMatch(trade: Trade, payment: Payment): Promise<void>;
}
