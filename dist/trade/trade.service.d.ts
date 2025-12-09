import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Trade, TradeStatus } from './entities/trade.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class TradeService {
    private tradeRepository;
    private httpService;
    private configService;
    private eventEmitter;
    private readonly logger;
    private readonly baseUrl;
    private readonly apiKey;
    private readonly apiSecret;
    constructor(tradeRepository: Repository<Trade>, httpService: HttpService, configService: ConfigService, eventEmitter: EventEmitter2);
    pollOrders(): Promise<void>;
    fetchBybitOrders(): Promise<never[]>;
    processOrders(orders: any[]): Promise<void>;
    upsertOrder(orderData: any): Promise<void>;
    mapStatus(bybitStatus: string): TradeStatus;
}
