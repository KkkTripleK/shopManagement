import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { orderStatus } from 'src/commons/common.enum';
import { createOrderDto } from './dto/dto.createOrder';
import { OrderEntity } from './order.entity';
import { OrderRepository } from './order.repo';

@Injectable()
export class OrderService {
  constructor(private orderRepo: OrderRepository) {}

  async getListOrder(fk_Username: string) {
    const listOrder = await this.orderRepo.getListOrder(fk_Username);
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
      if (orderInfo.id.length === 0) {
        throw new HttpException('OrderID is invalid!', HttpStatus.BAD_REQUEST);
      }
      return orderInfo;
    } catch (error) {
      throw new HttpException(
        'OrderID is not correct!',
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

  async updateOrder(orderId: string, param: object, fk_Username: string) {
    const orderInfo = this.getOrderByIdAndUsername(orderId, fk_Username);
    if ((await orderInfo).status !== orderStatus.SHOPPING) {
      throw new HttpException(
        'The order is shipping, can not change the order info!',
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
      return this.orderRepo.updateOrder(orderInfo, {
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
}
