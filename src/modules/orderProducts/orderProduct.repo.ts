import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createOrderProductDto } from './dto/dto.createOrderProduct';
import { OrderProductEntity } from './orderProduct.entity';

@Injectable()
export class OrderProductRepository {
  constructor(
    @InjectRepository(OrderProductEntity)
    private orderProductRepo: Repository<OrderProductEntity>,
  ) {}

  async showOrderProduct(orderProductId: string) {
    return this.orderProductRepo.findOne({
      where: [{ id: orderProductId }],
      relations: {
        fk_Order: true,
        fk_Product: true,
      },
    });
  }

  async addProductToOrder(
    requestBody: createOrderProductDto,
  ): Promise<OrderProductEntity> {
    return this.orderProductRepo.save(requestBody);
  }

  async getListProductByOrderId(orderId: string) {
    const result = this.orderProductRepo
      .createQueryBuilder('orderProduct')
      .leftJoinAndSelect('orderProduct.fk_Product', 'fk_Product')
      .leftJoinAndSelect('orderProduct.fk_Order', 'fk_Order')
      .where('fk_Order.id = :orderId', { orderId })
      .select([
        'orderProduct',
        'fk_Product.id',
        'fk_Product.name',
        'fk_Order.id',
      ])
      .getMany();
    return result;
  }
  async updateProductInOrder(
    orderProductInfo: OrderProductEntity,
    newQty: string,
  ) {
    orderProductInfo.qty = newQty;
    return orderProductInfo;
    //return this.orderProductRepo.save(orderProductInfo);
  }

  async deleteProductInOrder(orderProductId: string) {
    return this.orderProductRepo.delete({ id: orderProductId });
  }
}
