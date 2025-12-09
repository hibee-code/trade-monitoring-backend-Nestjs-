"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DecisionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const trade_entity_1 = require("../trade/entities/trade.entity");
const payment_entity_1 = require("../payment/entities/payment.entity");
const audit_service_1 = require("../audit/audit.service");
const notification_service_1 = require("../notification/notification.service");
let DecisionService = DecisionService_1 = class DecisionService {
    tradeRepository;
    paymentRepository;
    notificationService;
    auditService;
    logger = new common_1.Logger(DecisionService_1.name);
    constructor(tradeRepository, paymentRepository, notificationService, auditService) {
        this.tradeRepository = tradeRepository;
        this.paymentRepository = paymentRepository;
        this.notificationService = notificationService;
        this.auditService = auditService;
    }
    async handleTradeCreated(trade) {
        this.logger.log(`Checking payments for new trade: ${trade.orderId}`);
        await this.matchTrade(trade);
    }
    async handlePaymentReceived(payment) {
        this.logger.log(`Checking trades for new payment: ${payment.reference}`);
        const trade = await this.tradeRepository.findOne({
            where: {
                amount: payment.amount,
                status: trade_entity_1.TradeStatus.CREATED,
                isPaymentVerified: false,
            },
        });
        if (trade) {
            await this.confirmMatch(trade, payment);
        }
        else {
            this.logger.log(`No matching trade found for payment ${payment.reference}`);
        }
    }
    async matchTrade(trade) {
        const payment = await this.paymentRepository.findOne({
            where: {
                amount: trade.amount,
                status: 'success',
                matchedTradeId: (0, typeorm_2.IsNull)(),
            }
        });
        if (payment) {
            await this.confirmMatch(trade, payment);
        }
    }
    async confirmMatch(trade, payment) {
        this.logger.log(`MATCH FOUND: Trade ${trade.orderId} matches Payment ${payment.reference}`);
        trade.isPaymentVerified = true;
        trade.status = trade_entity_1.TradeStatus.PAID;
        payment.matchedTradeId = trade.orderId;
        await this.tradeRepository.save(trade);
        await this.paymentRepository.save(payment);
        await this.auditService.log('MATCH_SUCCESS', 'TRADE', trade.orderId, { paymentReference: payment.reference });
        await this.notificationService.sendAlert(`✅ Payment Verified for Trade ${trade.orderNo}\nAmount: ${trade.amount}\nBuyer: ${trade.buyerName}`);
    }
};
exports.DecisionService = DecisionService;
__decorate([
    (0, event_emitter_1.OnEvent)('trade.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [trade_entity_1.Trade]),
    __metadata("design:returntype", Promise)
], DecisionService.prototype, "handleTradeCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('payment.received'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_entity_1.Payment]),
    __metadata("design:returntype", Promise)
], DecisionService.prototype, "handlePaymentReceived", null);
exports.DecisionService = DecisionService = DecisionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(trade_entity_1.Trade)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService,
        audit_service_1.AuditService])
], DecisionService);
//# sourceMappingURL=decision.service.js.map