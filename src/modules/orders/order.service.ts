import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { orderStatus } from 'src/commons/common.enum';
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
    private orderProductService: OrderProductService, //private couponService: CouponService,
  ) {}

  async getListOrderByUsername(fk_Username: string) {
    const listOrder = await this.orderRepo.getListOrderByUsername(fk_Username);
    if (listOrder.length === 0) {
      throw new HttpException('The order list is empty!', HttpStatus.OK);
    }
    return listOrder;
  }

  async getOrderByIdAndUsername(
    orderId: string,
    fk_Username: string,
  ): Promise<OrderEntity> {
    try {
      const orderInfo = await this.orderRepo.checkOrderUserExist(
        fk_Username,
        orderId,
      );
      if (orderInfo === null) {
        throw new HttpException(
          'OrderID is invalid or has been removed!',
          HttpStatus.BAD_REQUEST,
        );
      }
      return orderInfo;
    } catch (error) {
      throw new HttpException(
        'OrderID is invalid or has been removed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async adminGetListOrder() {
    const listOrder = await this.orderRepo.adminGetListOrder();
    if (listOrder.length === 0) {
      throw new HttpException(
        'The order list is empty!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return listOrder;
  }

  async adminGetOrderByID(orderId: string) {
    try {
      const orderInfo = await this.orderRepo.adminGetOrderByID(orderId);
      if (orderInfo.length === 0) {
        throw new HttpException(
          'The order has been removed or invalid!',
          HttpStatus.BAD_REQUEST,
        );
      }
      return orderInfo;
    } catch (error) {
      throw new HttpException(
        'OrderID is not correct!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async adminGetOrderByUsername(username: string) {
    const orderInfo = await this.orderRepo.adminGetOrderByUsername(username);
    if (orderInfo.length === 0) {
      throw new HttpException(
        `Orders of User: ${username} has been removed or invalid!`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return orderInfo;
  }

  async createOrder(orderInfo: createOrderDto) {
    return this.orderRepo.createOrder(orderInfo);
  }

  async orderConfirm(orderId: string, fk_Username: string) {
    const orderInfo = await this.getOrderByIdAndUsername(orderId, fk_Username);
    /*
     ** Check total value of order
     */
    if (orderInfo.totalProductPrice === 0) {
      throw new HttpException(
        "Order doesn't have any product!",
        HttpStatus.BAD_REQUEST,
      );
    } else if (orderInfo.status !== orderStatus.SHOPPING) {
      throw new HttpException(
        'Can not change the status of this order!',
        HttpStatus.BAD_REQUEST,
      );
    }
    /*
     ** show list product by orderId
     */
    const listOrderProductInfo =
      await this.orderProductService.getListProductByOrderId(
        orderId,
        fk_Username,
      );
    for (const orderProductInfo of listOrderProductInfo) {
      const productInfo = orderProductInfo.fk_Product;
      if (productInfo.qtyRemaining < orderProductInfo.qty) {
        throw new HttpException(
          'The qty instock is not enouch!',
          HttpStatus.BAD_REQUEST,
        );
      }
      productInfo.qtyRemaining = String(
        Number(productInfo.qtyRemaining) - Number(orderProductInfo.qty),
      );
      await this.productRepo.createNewProduct(productInfo);
    }
    return this.orderRepo.updateOrder(orderInfo, {
      status: orderStatus.ORDERED,
    });
  }

  async updateOrder(orderId: string, param: object, fk_Username: string) {
    const orderInfo = await this.getOrderByIdAndUsername(orderId, fk_Username);
    if ((await orderInfo).status !== orderStatus.SHOPPING) {
      throw new HttpException(
        'The order is shipping, can not change the order info!',
        HttpStatus.BAD_REQUEST,
      );
    } else if ((await orderInfo).status === orderStatus.REMOVED) {
      throw new HttpException(
        'The order has been removed!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.orderRepo.updateOrder(orderInfo, param);
  }

  async deleteOrder(orderId: string, fk_Username: string) {
    const orderInfo = this.getOrderByIdAndUsername(orderId, fk_Username);
    if (
      (await orderInfo).status == orderStatus.SHOPPING ||
      (await orderInfo).status == orderStatus.COMPLETED
    ) {
      return this.orderRepo.updateOrder(await orderInfo, {
        status: orderStatus.REMOVED,
      });
    } else if ((await orderInfo).status == orderStatus.REMOVED) {
      throw new HttpException(
        'The order is removed already!',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      throw new HttpException(
        'The order is shipping, can not change the order info!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOrderInfoByProduct(productInfo: ProductEntity) {
    // find all OrderProduct have ProductId
    const listOrderProductInfo =
      await this.orderProductService.getListOrderProductByProductId(
        productInfo.id,
      );
    for (const orderProductInfo of listOrderProductInfo) {
      // const oldOrderProductTotalPrice = Number(orderProductInfo.totalPrice);
      // new price
      orderProductInfo.price = Number(productInfo.netPrice);
      //difference between oldPrice and newPrice
      const differencePrice =
        orderProductInfo.price * Number(orderProductInfo.qty) -
        Number(orderProductInfo.totalPrice);
      // save differencePrice to DB
      orderProductInfo.totalPrice += differencePrice;
      // save new data to orderProductInfo
      await this.orderProductService.updateOrderProduct(orderProductInfo);
      orderProductInfo.fk_Order.totalProductPrice += differencePrice;
      orderProductInfo.fk_Order.totalOrderPrice += differencePrice;
      await this.orderRepo.createOrder(orderProductInfo.fk_Order);
    }
    return { listOrderProductInfo };
  }

  async addCouponToOrder(requestBody: addCouponDto, username: string) {
    // 1. check valid orderId: exist, orderStatus
    // 2. check valid couponId: exist, orderStatus, qty
    // Step 1:
    const orderInfo = await this.getOrderByIdAndUsername(
      requestBody.orderId,
      username,
    );
    if (orderInfo.status !== orderStatus.SHOPPING) {
      throw new HttpException(
        `Can not add coupon to Order ${requestBody.orderId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    // Step 2:
    const listOrderInfo = await this.getListOrderByUsername(username);
    for (const orderInfo of listOrderInfo) {
      if (orderInfo.fk_Coupon.id === requestBody.couponId) {
        throw new HttpException(
          `Coupon ${requestBody.couponId} was used already`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    // const couponInfo = await this.
  }
}
