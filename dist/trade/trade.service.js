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
var TradeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const trade_entity_1 = require("./entities/trade.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
let TradeService = TradeService_1 = class TradeService {
    tradeRepository;
    httpService;
    configService;
    eventEmitter;
    logger = new common_1.Logger(TradeService_1.name);
    baseUrl;
    apiKey;
    apiSecret;
    constructor(tradeRepository, httpService, configService, eventEmitter) {
        this.tradeRepository = tradeRepository;
        this.httpService = httpService;
        this.configService = configService;
        this.eventEmitter = eventEmitter;
        this.baseUrl = this.configService.get('BYBIT_BASE_URL') || '';
        this.apiKey = this.configService.get('BYBIT_API_KEY') || '';
        this.apiSecret = this.configService.get('BYBIT_API_SECRET') || '';
    }
    async pollOrders() {
        this.logger.debug('Polling Bybit P2P orders...');
        try {
            const orders = await this.fetchBybitOrders();
            await this.processOrders(orders);
        }
        catch (error) {
            this.logger.error('Error polling orders', error);
        }
    }
    async fetchBybitOrders() {
        return [];
    }
    async processOrders(orders) {
        for (const orderData of orders) {
            await this.upsertOrder(orderData);
        }
    }
    async upsertOrder(orderData) {
        const existingOrder = await this.tradeRepository.findOneBy({ orderId: orderData.orderId });
        const status = this.mapStatus(orderData.orderStatus);
        if (existingOrder) {
            if (existingOrder.status !== status) {
                existingOrder.status = status;
                await this.tradeRepository.save(existingOrder);
                this.logger.log(`Order ${existingOrder.orderId} status updated to ${status}`);
            }
        }
        else {
            const newTrade = this.tradeRepository.create({
                orderId: orderData.orderId,
                orderNo: orderData.orderNo,
                amount: orderData.amount,
                price: orderData.price,
                currency: orderData.currency,
                token: orderData.token,
                buyerName: orderData.buyerName,
                status: status,
            });
            await this.tradeRepository.save(newTrade);
            this.logger.log(`New order created: ${newTrade.orderId}`);
            this.eventEmitter.emit('trade.created', newTrade);
        }
    }
    mapStatus(bybitStatus) {
        switch (bybitStatus) {
            case 'Pending': return trade_entity_1.TradeStatus.CREATED;
            case 'Paid': return trade_entity_1.TradeStatus.PAID;
            case 'Completed': return trade_entity_1.TradeStatus.COMPLETED;
            case 'Cancelled': return trade_entity_1.TradeStatus.CANCELLED;
            default: return trade_entity_1.TradeStatus.CREATED;
        }
    }
};
exports.TradeService = TradeService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TradeService.prototype, "pollOrders", null);
exports.TradeService = TradeService = TradeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(trade_entity_1.Trade)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService,
        config_1.ConfigService,
        event_emitter_1.EventEmitter2])
], TradeService);
//# sourceMappingURL=trade.service.js.map