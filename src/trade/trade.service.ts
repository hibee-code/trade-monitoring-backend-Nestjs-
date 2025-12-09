import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Trade, TradeStatus } from './entities/trade.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TradeService {
    private readonly logger = new Logger(TradeService.name);
    private readonly baseUrl: string;
    private readonly apiKey: string;
    private readonly apiSecret: string;

    constructor(
        @InjectRepository(Trade)
        private tradeRepository: Repository<Trade>,
        private httpService: HttpService,
        private configService: ConfigService,
        private eventEmitter: EventEmitter2,
    ) {
        this.baseUrl = this.configService.get<string>('BYBIT_BASE_URL') || '';
        this.apiKey = this.configService.get<string>('BYBIT_API_KEY') || '';
        this.apiSecret = this.configService.get<string>('BYBIT_API_SECRET') || '';
    }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async pollOrders() {
        this.logger.debug('Polling Bybit P2P orders...');
        try {
            // Logic to fetch orders from Bybit
            const orders = await this.fetchBybitOrders();
            await this.processOrders(orders);
        } catch (error) {
            this.logger.error('Error polling orders', error);
        }
    }

    // Placeholder for Bybit API call
    async fetchBybitOrders() {
        // Implement signature generation and API call here.
        return [];
    }

    async processOrders(orders: any[]) {
        for (const orderData of orders) {
            await this.upsertOrder(orderData);
        }
    }

    async upsertOrder(orderData: any) {
        // Map Bybit data to Trade entity
        const existingOrder = await this.tradeRepository.findOneBy({ orderId: orderData.orderId });

        const status = this.mapStatus(orderData.orderStatus);

        if (existingOrder) {
            if (existingOrder.status !== status) {
                existingOrder.status = status;
                await this.tradeRepository.save(existingOrder);
                this.logger.log(`Order ${existingOrder.orderId} status updated to ${status}`);
                // Trigger notification event here (or via subscriber)
            }
        } else {
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

    mapStatus(bybitStatus: string): TradeStatus {
        // Map Bybit status strings to enum
        switch (bybitStatus) {
            case 'Pending': return TradeStatus.CREATED;
            case 'Paid': return TradeStatus.PAID;
            case 'Completed': return TradeStatus.COMPLETED;
            case 'Cancelled': return TradeStatus.CANCELLED;
            // ...
            default: return TradeStatus.CREATED;
        }
    }
}
