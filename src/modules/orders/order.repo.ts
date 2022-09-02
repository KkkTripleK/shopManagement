import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { orderStatus } from 'src/commons/common.enum';
import { Repository } from 'typeorm';
import { createOrderDto } from './dto/dto.createOrder';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepo: Repository<OrderEntity>,
  ) {}

  async getListOrder(fk_Username: string): Promise<OrderEntity[]> {
    const listOrder = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.fk_User', 'fk_User')
      .select(['order'])
      .where('fk_User.username LIKE :fk_Username', { fk_Username })
      .andWhere('order.status IN (:...status)', {
        status: [
          orderStatus.SHOPPING,
          orderStatus.SHIPPING,
          orderStatus.ORDERED,
          orderStatus.COMPLETED,
        ],
      })
      .getMany();
    return listOrder;
  }

  async checkOrderUserExist(fk_Username: string, orderId: string) {
    const result = this.orderRepo
      .createQueryBuilder('order')
      .where('fk_User.username LIKE :fk_Username', { fk_Username })
      .andWhere('order.id = :id', { id: orderId })
      .andWhere('order.status IN (:...status)', {
        status: [
          orderStatus.SHOPPING,
          orderStatus.SHIPPING,
          orderStatus.ORDERED,
          orderStatus.COMPLETED,
        ],
      })
      .leftJoinAndSelect('order.fk_User', 'fk_User')
      .select(['order'])
      .getOne();
    return result;
  }

  async adminGetListOrder() {
    const listOrder = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.fk_User', 'fk_User')
      .select(['order', 'fk_User.username'])
      .where('order.status IN (:...status)', {
        status: [
          orderStatus.SHOPPING,
          orderStatus.SHIPPING,
          orderStatus.ORDERED,
          orderStatus.COMPLETED,
        ],
      })
      .getMany();
    return listOrder;
  }

  async adminGetOrderByID(orderId: string) {
    const listOrder = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.fk_User', 'fk_User')
      .select(['order', 'fk_User.username'])
      .where('order.id = :id', { id: orderId })
      .andWhere('order.status IN (:...status)', {
        status: [
          orderStatus.SHOPPING,
          orderStatus.SHIPPING,
          orderStatus.ORDERED,
          orderStatus.COMPLETED,
        ],
      })
      .getMany();
    return listOrder;
  }

  async adminGetOrderByUsername(fk_Username: string) {
    const listOrder = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.fk_User', 'fk_User')
      .select(['order', 'fk_User.username'])
      .where('fk_User.username LIKE :fk_Username', { fk_Username })
      .andWhere('order.status IN (:...status)', {
        status: [
          orderStatus.SHOPPING,
          orderStatus.SHIPPING,
          orderStatus.ORDERED,
          orderStatus.COMPLETED,
        ],
      })
      .getMany();
    return listOrder;
  }

  async createOrder(orderInfo: createOrderDto) {
    return this.orderRepo.save(orderInfo);
  }

  async updateOrder(orderInfo: object, param: object) {
    for (const key in orderInfo) {
      orderInfo[key] = param[key];
    }
    return this.orderRepo.save(orderInfo);
  }
}
