import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DecisionService } from './decision.service';
import { Trade } from '../trade/entities/trade.entity';
import { Payment } from '../payment/entities/payment.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { NotificationModule } from '../notification/notification.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trade, Payment, AuditLog]),
    NotificationModule,
    AuditModule,
  ],
  providers: [DecisionService],
})
export class DecisionModule { }
