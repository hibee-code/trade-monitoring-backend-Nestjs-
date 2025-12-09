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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trade = exports.TradeStatus = void 0;
const typeorm_1 = require("typeorm");
var TradeStatus;
(function (TradeStatus) {
    TradeStatus["CREATED"] = "CREATED";
    TradeStatus["PAID"] = "PAID";
    TradeStatus["COMPLETED"] = "COMPLETED";
    TradeStatus["CANCELLED"] = "CANCELLED";
    TradeStatus["APPEAL"] = "APPEAL";
})(TradeStatus || (exports.TradeStatus = TradeStatus = {}));
let Trade = class Trade {
    orderId;
    orderNo;
    amount;
    price;
    currency;
    token;
    buyerName;
    buyerRealName;
    status;
    paymentMethod;
    createdAt;
    updatedAt;
    isPaymentVerified;
};
exports.Trade = Trade;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Trade.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trade.prototype, "orderNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8 }),
    __metadata("design:type", Number)
], Trade.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], Trade.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trade.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trade.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trade.prototype, "buyerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Trade.prototype, "buyerRealName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TradeStatus, default: TradeStatus.CREATED }),
    __metadata("design:type", String)
], Trade.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Trade.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Trade.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Trade.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Trade.prototype, "isPaymentVerified", void 0);
exports.Trade = Trade = __decorate([
    (0, typeorm_1.Entity)()
], Trade);
//# sourceMappingURL=trade.entity.js.map