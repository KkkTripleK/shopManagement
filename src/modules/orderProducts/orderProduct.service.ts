import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { orderShipment, orderStatus, productStatus } from 'src/commons/common.enum';
import { OrderService } from '../orders/order.service';
import { ProductEntity } from '../products/product.entity';
import { ProductRepository } from '../products/product.repo';
import { createOrderProductDto } from './dto/dto.createOrderProduct';
import { OrderProductEntity } from './orderProduct.entity';
import { OrderProductRepository } from './orderProduct.repo';

@Injectable()
export class OrderProductService {
    constructor(
        private orderProductRepo: OrderProductRepository,
        private productRepo: ProductRepository,
        @Inject(forwardRef(() => OrderService))
        private orderService: OrderService,
    ) {}

    async createOrderProduct(orderProductInfo: createOrderProductDto, username: string): Promise<OrderProductEntity> {
        /*
        Check valid fk_Order
        */
        const orderInfo = await this.orderService.getOrderByOrderIdAndUsername(
            orderProductInfo.fk_Order.toString(),
            username,
        );
        if (orderInfo.status !== orderStatus.SHOPPING) {
            throw new BadRequestException('Can not change the order!');
        }
        /*
        Check valid fk_Product
        */
        const productInfo = await this.checkProductExist(orderProductInfo.fk_Product);
        if (productInfo.status === productStatus.INACTIVE || productInfo.status === productStatus.OUTSTOCK) {
            throw new BadRequestException(`${productInfo.name} is Inactive or Out-stock!`);
        }
        /*
        Check coupon exist
        */
        let couponDiscount = 0;
        if (orderInfo.fk_Coupon === null) {
            couponDiscount = 0;
        } else {
            couponDiscount = orderInfo.fk_Coupon.discount;
        }
        /*
        Check orderProduct exist
        */
        const listOrderProduct = await this.getListProductByOrderId(orderProductInfo.fk_Order.toString(), username);
        for (const oldOrderProductInfo of listOrderProduct) {
            if (Number(oldOrderProductInfo.fk_Product.id) === Number(orderProductInfo.fk_Product)) {
                /*
                Check qty after change
                */
                const productQty = await this.checkQtyRemain(
                    productInfo,
                    Number(orderProductInfo.qty) + Number(oldOrderProductInfo.qty),
                );
                if (productQty > Number(productInfo.qtyRemaining)) {
                    throw new BadRequestException('Your order quantities is higher than quantity in stock!');
                }

                // Caculate price of orderInfo, save to DB
                const newOrderProductPrice = oldOrderProductInfo.price * Number(orderProductInfo.qty);
                const newOrderProductPrice_discounted = (newOrderProductPrice * (100 - couponDiscount)) / 100;
                oldOrderProductInfo.qty = productQty.toString();
                oldOrderProductInfo.totalPrice += newOrderProductPrice;
                orderInfo.totalProductPrice += newOrderProductPrice;
                orderInfo.totalOrderPrice += newOrderProductPrice_discounted;
                await this.orderService.createOrder(orderInfo);
                return this.orderProductRepo.createOrderProduct(oldOrderProductInfo);
            }
        }
        /*
        Check qty input
        */
        const orderQty = await this.checkQtyRemain(productInfo, Number(orderProductInfo.qty));
        /*
        OrderProduct not exist
        */
        orderProductInfo.qty = orderQty.toString();
        orderProductInfo.price = Number(productInfo.price);
        if (orderInfo.shipment === orderShipment.GHN && orderInfo.shipmentPrice === 0) {
            orderInfo.shipmentPrice = 30000;
            orderInfo.totalOrderPrice = orderInfo.shipmentPrice;
        } else if (orderInfo.shipment === orderShipment.VIETTELPOST && orderInfo.shipmentPrice === 0) {
            orderInfo.shipmentPrice = 35000;
            orderInfo.totalOrderPrice = orderInfo.shipmentPrice;
        }
        const newOrderProductPrice = orderProductInfo.price * orderQty;
        const newOrderProductPrice_discounted = (newOrderProductPrice * (100 - couponDiscount)) / 100;
        orderProductInfo.totalPrice = newOrderProductPrice;
        orderInfo.totalProductPrice += newOrderProductPrice;
        orderInfo.totalOrderPrice += newOrderProductPrice_discounted;
        await this.orderService.createOrder(orderInfo);
        return this.orderProductRepo.createOrderProduct(orderProductInfo);
    }

    async getListProductByOrderId(orderId: string, username: string): Promise<OrderProductEntity[]> {
        await this.orderService.getOrderByOrderIdAndUsername(orderId, username);
        return this.orderProductRepo.getListProductByOrderId(orderId);
    }

    async adminGetListProductByOrderId(orderId: string): Promise<OrderProductEntity[]> {
        const listProduct = await this.orderProductRepo.getListProductByOrderId(orderId);
        if (listProduct.length === 0) {
            throw new BadRequestException('The order is empty!');
        }
        return listProduct;
    }

    async updateProductInOrderProduct(orderProductId: string, newQty: string, username: string) {
        const orderProductInfo = await this.orderProductRepo.updateProductInOrderProduct(orderProductId);
        if (orderProductInfo === null) {
            throw new BadRequestException('OrderProductID is invalid!');
        }
        const productInfo = await this.checkProductExist(orderProductInfo.fk_Product.id);
        await this.checkQtyRemain(productInfo, Number(newQty));
        const orderInfo = await this.orderService.getOrderByOrderIdAndUsername(orderProductInfo.fk_Order.id, username);
        const oldTotalPrice = orderProductInfo.totalPrice;
        /*
        Save new Data to OrderProductTable
        */
        orderProductInfo.qty = newQty;
        orderProductInfo.totalPrice = Number(newQty) * orderProductInfo.price;
        await this.orderProductRepo.createOrderProduct(orderProductInfo);
        /*
        Save new Data to OrderTable
        */
        orderInfo.totalProductPrice = orderInfo.totalProductPrice - oldTotalPrice + orderProductInfo.totalPrice;
        orderInfo.totalOrderPrice = orderInfo.totalOrderPrice - oldTotalPrice + orderProductInfo.totalPrice;
        await this.orderService.createOrder(orderInfo);
        return `Update orderProduct ${orderProductId} successful!`;
    }

    async checkProductExist(productId): Promise<ProductEntity> {
        const productInfo = await this.productRepo.showProductByProductId({
            id: productId,
        });
        if (productInfo === null) {
            throw new BadRequestException('ProductID is invalid!');
        }
        return productInfo;
    }

    async checkQtyRemain(productInfo: ProductEntity, orderQty: number) {
        if (orderQty > Number(productInfo.qtyRemaining)) {
            throw new BadRequestException('Your order quantities is higher than quantity in stock!');
        } else if (orderQty === 0) {
            throw new BadRequestException('The minimum of order quantity is 1!');
        } else if (orderQty < 0) {
            throw new BadRequestException('Product qty can not smaller than 0!');
        }
        return orderQty;
    }

    async deleteOrderProductInOrder(orderProductId: string, username: string) {
        const orderProductInfo = await this.orderProductRepo.updateProductInOrderProduct(orderProductId);
        // check status of Orders, status === shopping --> Update Orders

        const orderInfo = await this.orderService.getOrderByOrderIdAndUsername(orderProductInfo.fk_Order.id, username);

        if (orderInfo.status !== orderStatus.SHOPPING) {
            throw new BadRequestException('Can not delete orderProduct!');
        }
        orderInfo.totalProductPrice -= orderProductInfo.totalPrice;
        orderInfo.totalOrderPrice -= orderProductInfo.totalPrice;
        // when order is empty
        if (orderInfo.totalProductPrice === 0) {
            orderInfo.shipmentPrice = 0;
            orderInfo.totalOrderPrice = 0;
        }
        if (orderInfo.fk_OrderProduct === undefined) {
            throw new HttpException('List order-product is empty!', HttpStatus.OK);
        }
        await this.orderService.createOrder(orderInfo);
        this.orderProductRepo.deleteProductInOrder(orderProductId);
    }

    async adminDeleteOrderProductInOrder(orderProductId: string) {
        // Step 3. Check status of Orders, status === Shopping --> Update
        const orderProductInfo = await this.orderProductRepo.updateProductInOrderProduct(orderProductId);
        const orderInfo = await this.orderService.adminGetOrderByOrderID(orderProductInfo.fk_Order.id);
        if (orderInfo.status === orderStatus.SHOPPING) {
            orderInfo.totalProductPrice -= orderProductInfo.totalPrice;
            if (orderInfo.fk_Coupon !== null) {
                orderInfo.totalOrderPrice =
                    orderInfo.totalOrderPrice -
                    orderProductInfo.totalPrice * ((100 - Number(orderInfo.fk_Coupon.discount)) / 100);
            } else {
                orderInfo.totalOrderPrice -= orderProductInfo.totalPrice;
            }
            // when order is empty
            if (orderInfo.totalProductPrice === 0) {
                orderInfo.shipmentPrice = 0;
                orderInfo.totalOrderPrice = 0;
            }
            // Step 4. Update price of Order
            await this.orderService.createOrder(orderInfo);
            // Step 5. Delete orderProduct
            this.orderProductRepo.deleteProductInOrder(orderProductId);
        }
    }

    async getListOrderProductByProductId(productId: string) {
        return this.orderProductRepo.getListOrderProductByProductId(productId);
    }

    async updateOrderProduct(orderProductInfo: createOrderProductDto) {
        return this.orderProductRepo.createOrderProduct(orderProductInfo);
    }
}
