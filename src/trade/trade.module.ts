import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { Trade } from './entities/trade.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Trade]),
        HttpModule,
    ],
    controllers: [TradeController],
    providers: [TradeService],
    exports: [TradeService],
})
export class TradeModule { }
