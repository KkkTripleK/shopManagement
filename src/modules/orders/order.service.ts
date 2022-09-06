import { BadRequestException, Injectable } from '@nestjs/common';
import { couponStatus, orderStatus } from 'src/commons/common.enum';
import { CouponService } from '../coupons/coupon.service';
import { OrderProductService } from '../orderProducts/orderProduct.service';
import { ProductEntity } from '../products/product.entity';
import { ProductRepository } from '../products/product.repo';
import { addCouponDto } from './dto/dto.addCoupon';
import { createOrderDto } from './dto/dto.createOrder';
import { OrderEntity } from './order.entity';
import { OrderRepository } from './order.repo';

@Injectable()
export class OrderService {
    constructor(
        private orderRepo: OrderRepository,
        private productRepo: ProductRepository,
        private orderProductService: OrderProductService,
        private couponService: CouponService,
    ) {}

    async getListOrderByUsername(fk_Username: string) {
        const listOrder = await this.orderRepo.getListOrderByUsername(fk_Username);
        if (listOrder.length === 0) {
            throw new BadRequestException('The order list is empty!');
        }
        return listOrder;
    }

    async getOrderByOrderIdAndUsername(orderId: string, fk_Username: string): Promise<OrderEntity> {
        try {
            const orderInfo = await this.orderRepo.checkOrderUserExist(fk_Username, orderId);
            if (orderInfo === null) {
                throw new BadRequestException('OrderID is invalid or has been removed!');
            }
            return orderInfo;
        } catch (error) {
            throw new BadRequestException('OrderID is invalid or has been removed!');
        }
    }

    async adminGetListOrder() {
        const listOrder = await this.orderRepo.adminGetListOrder();
        if (listOrder.length === 0) {
            throw new BadRequestException('The order list is empty!');
        }
        return listOrder;
    }

    async adminGetOrderByOrderID(orderId: string) {
        try {
            const orderInfo = await this.orderRepo.adminGetOrderByOrderID(orderId);
            if (orderInfo === null) {
                throw new BadRequestException('The order has been removed or invalid!');
            }
            return orderInfo;
        } catch (error) {
            throw new BadRequestException('OrderID is not correct!');
        }
    }

    async adminGetOrderByUsername(username: string) {
        const orderInfo = await this.orderRepo.adminGetOrderByUsername(username);
        if (orderInfo.length === 0) {
            throw new BadRequestException(`Orders of User: ${username} has been removed or invalid!`);
        }
        return orderInfo;
    }

    async createOrder(orderInfo: createOrderDto) {
        return this.orderRepo.createOrder(orderInfo);
    }

    async orderConfirm(orderId: string, fk_Username: string) {
        const orderInfo = await this.getOrderByOrderIdAndUsername(orderId, fk_Username);
        /*
         ** Check total value of order
         */
        if (orderInfo.totalProductPrice === 0) {
            throw new BadRequestException("Order doesn't have any product!");
        } else if (orderInfo.status !== orderStatus.SHOPPING) {
            throw new BadRequestException('Can not change the status of this order!');
        }
        /*
         ** show list product by orderId
         */
        const listOrderProductInfo = await this.orderProductService.getListProductByOrderId(orderId, fk_Username);
        for (const orderProductInfo of listOrderProductInfo) {
            const productInfo = orderProductInfo.fk_Product;
            if (productInfo.qtyRemaining < orderProductInfo.qty) {
                throw new BadRequestException('The qty instock is not enouch!');
            }
            productInfo.qtyRemaining = String(Number(productInfo.qtyRemaining) - Number(orderProductInfo.qty));
            await this.productRepo.createNewProduct(productInfo);
        }
        return this.orderRepo.updateOrder(orderInfo, {
            status: orderStatus.ORDERED,
        });
    }

    async updateOrder(orderId: string, param: object, fk_Username: string) {
        const orderInfo = await this.getOrderByOrderIdAndUsername(orderId, fk_Username);
        if ((await orderInfo).status !== orderStatus.SHOPPING) {
            throw new BadRequestException('The order is shipping, can not change the order info!');
        } else if ((await orderInfo).status === orderStatus.REMOVED) {
            throw new BadRequestException('The order has been removed!');
        }
        return this.orderRepo.updateOrder(orderInfo, param);
    }

    async deleteOrder(orderId: string, fk_Username: string) {
        const orderInfo = this.getOrderByOrderIdAndUsername(orderId, fk_Username);
        if ((await orderInfo).status == orderStatus.SHOPPING || (await orderInfo).status == orderStatus.COMPLETED) {
            return this.orderRepo.updateOrder(await orderInfo, {
                status: orderStatus.REMOVED,
            });
        } else if ((await orderInfo).status == orderStatus.REMOVED) {
            throw new BadRequestException('The order is removed already!');
        } else {
            throw new BadRequestException('The order is shipping, can not change the order info!');
        }
    }

    async updateOrderInfoByProduct(productInfo: ProductEntity) {
        // Step 3. Find orderProducts, Orders include product
        const listOrderProductInfo = await this.orderProductService.getListOrderProductByProductId(productInfo.id);
        // Step 4. Check status of Orders
        for (const orderProductInfo of listOrderProductInfo) {
            if (orderProductInfo.fk_Order.status === orderStatus.SHOPPING) {
                // New price
                orderProductInfo.price = Number(productInfo.netPrice);

                const differencePrice =
                    orderProductInfo.price * Number(orderProductInfo.qty) - Number(orderProductInfo.totalPrice);
                orderProductInfo.totalPrice = orderProductInfo.price * Number(orderProductInfo.qty);
                // Step 5. Update info that orderProduct and Order
                orderProductInfo.fk_Order.totalProductPrice += differencePrice;
                const orderInfo = await this.adminGetOrderByOrderID(orderProductInfo.fk_Order.id);
                orderInfo.totalProductPrice += differencePrice;
                if (orderInfo.fk_Coupon === null) {
                    orderInfo.totalOrderPrice += differencePrice;
                } else {
                    const discount = orderInfo.fk_Coupon.discount;
                    orderInfo.totalOrderPrice += (differencePrice * (100 - discount)) / 100;
                }

                await this.orderProductService.updateOrderProduct(orderProductInfo);
                await this.orderRepo.createOrder(orderInfo);
            }
        }
        return { listOrderProductInfo };
    }

    async addCouponToOrder(requestBody: addCouponDto, username: string) {
        /*
    1. Check valid orderId: exist, orderStatus, orderTotalPrice
    2. Check valid couponId: exist, orderStatus, qty
    3. Update OrderInfo: totalOrderPrice
    */
        // Step 1. Check valid orderId: exist, orderStatus, orderTotalPrice
        const couponId = requestBody.couponId;
        const orderInfo = await this.getOrderByOrderIdAndUsername(requestBody.orderId, username);
        if (orderInfo.status !== orderStatus.SHOPPING) {
            throw new BadRequestException(`Can not add coupon to Order ${requestBody.orderId}`);
        } else if (orderInfo.totalOrderPrice === 0) {
            throw new BadRequestException(`Order  <${requestBody.orderId}> doesn't have any product!`);
        }
        // Step 2. Check valid couponId: exist, orderStatus, qty
        const couponInfo = await this.couponService.getCouponById(couponId);
        if (couponInfo === null) {
            throw new BadRequestException(`Coupon ${couponId} is invalid`);
        } else if (couponInfo.status === couponStatus.INACTIVE) {
            throw new BadRequestException(`Coupon ${couponId} is inactived`);
        } else if (couponInfo.qtyRemain === 0) {
            throw new BadRequestException(`Coupon ${couponId} is not available`);
        }
        const listOrderInfo = await this.getListOrderByUsername(username);
        for (const orderInfo of listOrderInfo) {
            if (orderInfo.fk_Coupon !== null) {
                if (orderInfo.fk_Coupon.id === couponId) {
                    throw new BadRequestException(`Coupon ${couponId} was used already`);
                }
            }
        }
        // Step 3. Update OrderInfo: totalOrderPrice
        orderInfo.fk_Coupon = couponInfo;
        orderInfo.totalOrderPrice = (orderInfo.totalOrderPrice * (100 - Number(couponInfo.discount))) / 100;
        return this.createOrder(orderInfo);
    }
}
