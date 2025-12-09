"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const decision_service_1 = require("./decision.service");
const trade_entity_1 = require("../trade/entities/trade.entity");
const payment_entity_1 = require("../payment/entities/payment.entity");
const audit_log_entity_1 = require("../audit/entities/audit-log.entity");
const notification_module_1 = require("../notification/notification.module");
const audit_module_1 = require("../audit/audit.module");
let DecisionModule = class DecisionModule {
};
exports.DecisionModule = DecisionModule;
exports.DecisionModule = DecisionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([trade_entity_1.Trade, payment_entity_1.Payment, audit_log_entity_1.AuditLog]),
            notification_module_1.NotificationModule,
            audit_module_1.AuditModule,
        ],
        providers: [decision_service_1.DecisionService],
    })
], DecisionModule);
//# sourceMappingURL=decision.module.js.map