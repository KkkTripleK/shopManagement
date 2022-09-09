import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { orderStatus } from '../../commons/common.enum';
import { createOrderDto } from './dto/dto.createOrder';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderRepository {
    constructor(
        @InjectRepository(OrderEntity)
        private orderRepo: Repository<OrderEntity>,
    ) {}

    async getListOrderByUsername(fk_Username: string): Promise<OrderEntity[]> {
        const listOrder = this.orderRepo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.fk_User', 'fk_User')
            .leftJoinAndSelect('order.fk_Coupon', 'fk_Coupon')
            .leftJoinAndSelect('order.fk_OrderProduct', 'fk_OrderProduct')
            .leftJoinAndSelect('order.fk_FlashSaleProduct', 'fk_FlashSaleProduct')
            .select([
                'order',
                'fk_OrderProduct.id',
                'fk_OrderProduct.totalPrice',
                'fk_Coupon',
                'fk_FlashSaleProduct.id',
                'fk_FlashSaleProduct.discount',
            ])
            .where('fk_User.username LIKE :fk_Username', { fk_Username })
            .andWhere('order.status IN (:...status)', {
                status: [orderStatus.SHOPPING, orderStatus.SHIPPING, orderStatus.ORDERED, orderStatus.COMPLETED],
            })
            .getMany();
        return listOrder;
    }

    async showListOrderByUsername(options: IPaginationOptions, fk_Username: string): Promise<Pagination<OrderEntity>> {
        const listOrder = this.orderRepo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.fk_User', 'fk_User')
            .leftJoinAndSelect('order.fk_Coupon', 'fk_Coupon')
            .leftJoinAndSelect('order.fk_OrderProduct', 'fk_OrderProduct')
            .leftJoinAndSelect('order.fk_FlashSaleProduct', 'fk_FlashSaleProduct')
            .select([
                'order',
                'fk_OrderProduct.id',
                'fk_OrderProduct.totalPrice',
                'fk_Coupon.id',
                'fk_Coupon.discount',
                'fk_OrderProduct.id',
                'fk_OrderProduct.totalPrice',
                'fk_FlashSaleProduct.id',
                'fk_FlashSaleProduct.discount',
                'fk_FlashSaleProduct.totalQty',
                'fk_FlashSaleProduct.qtyRemain',
            ])
            .where('fk_User.username LIKE :fk_Username', { fk_Username })
            .andWhere('order.status IN (:...status)', {
                status: [orderStatus.SHOPPING, orderStatus.SHIPPING, orderStatus.ORDERED, orderStatus.COMPLETED],
            });
        if (listOrder === null) {
            throw new BadRequestException('The order list is empty!');
        }
        return paginate<OrderEntity>(listOrder, options);
    }

    async checkOrderUserExist(fk_Username: string, orderId: string) {
        const result = this.orderRepo
            .createQueryBuilder('order')
            .where('fk_User.username LIKE :fk_Username', { fk_Username })
            .andWhere('order.id = :id', { id: orderId })
            .andWhere('order.status IN (:...status)', {
                status: [orderStatus.SHOPPING, orderStatus.SHIPPING, orderStatus.ORDERED, orderStatus.COMPLETED],
            })
            .leftJoinAndSelect('order.fk_User', 'fk_User')
            .leftJoinAndSelect('order.fk_Coupon', 'fk_Coupon')
            .leftJoinAndSelect('order.fk_OrderProduct', 'fk_OrderProduct')
            .leftJoinAndSelect('order.fk_FlashSaleProduct', 'fk_FlashSaleProduct')
            .select([
                'order',
                'fk_OrderProduct',
                'fk_Coupon',
                'fk_FlashSaleProduct.id',
                'fk_FlashSaleProduct.discount',
                'fk_FlashSaleProduct.totalQty',
                'fk_FlashSaleProduct.qtyRemain',
            ])
            .getOne();
        return result;
    }

    async adminGetListOrder(options: IPaginationOptions): Promise<Pagination<OrderEntity>> {
        const listOrder = this.orderRepo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.fk_User', 'fk_User')
            .leftJoinAndSelect('order.fk_Coupon', 'fk_Coupon')
            .leftJoinAndSelect('order.fk_OrderProduct', 'fk_OrderProduct')
            .leftJoinAndSelect('order.fk_FlashSaleProduct', 'fk_FlashSaleProduct')
            .select([
                'order',
                'fk_User.username',
                'fk_OrderProduct',
                'fk_Coupon.id',
                'fk_Coupon.discount',
                'fk_FlashSaleProduct.id',
                'fk_FlashSaleProduct.discount',
                'fk_FlashSaleProduct.totalQty',
                'fk_FlashSaleProduct.qtyRemain',
            ])
            .where('order.status IN (:...status)', {
                status: [orderStatus.SHOPPING, orderStatus.SHIPPING, orderStatus.ORDERED, orderStatus.COMPLETED],
            })
            .orderBy('fk_User.username');
        if (listOrder === null) {
            throw new BadRequestException('The order list is empty!');
        }
        return paginate<OrderEntity>(listOrder, options);
    }

    async adminGetOrderByOrderID(orderId: string) {
        const orderInfo = this.orderRepo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.fk_User', 'fk_User')
            .leftJoinAndSelect('order.fk_Coupon', 'fk_Coupon')
            .leftJoinAndSelect('order.fk_OrderProduct', 'fk_OrderProduct')
            .leftJoinAndSelect('order.fk_FlashSaleProduct', 'fk_FlashSaleProduct')
            .select([
                'order',
                'fk_User.username',
                'fk_OrderProduct',
                'fk_Coupon.id',
                'fk_Coupon.discount',
                'fk_FlashSaleProduct.id',
                'fk_FlashSaleProduct.discount',
                'fk_FlashSaleProduct.totalQty',
                'fk_FlashSaleProduct.qtyRemain',
            ])
            .where('order.id = :id', { id: orderId })
            .andWhere('order.status IN (:...status)', {
                status: [orderStatus.SHOPPING, orderStatus.SHIPPING, orderStatus.ORDERED, orderStatus.COMPLETED],
            })
            .getOne();
        return orderInfo;
    }

    async adminGetOrderByUsername(options: IPaginationOptions, fk_Username: string) {
        const listOrder = this.orderRepo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.fk_User', 'fk_User')
            .leftJoinAndSelect('order.fk_Coupon', 'fk_Coupon')
            .leftJoinAndSelect('order.fk_OrderProduct', 'fk_OrderProduct')
            .leftJoinAndSelect('order.fk_FlashSaleProduct', 'fk_FlashSaleProduct')
            .select([
                'order',
                'fk_User.username',
                'fk_OrderProduct',
                'fk_Coupon.id',
                'fk_Coupon.discount',
                'fk_FlashSaleProduct.id',
                'fk_FlashSaleProduct.discount',
                'fk_FlashSaleProduct.totalQty',
                'fk_FlashSaleProduct.qtyRemain',
            ])
            .where('fk_User.username LIKE :username', {
                username: `%${fk_Username}%`,
            })
            .andWhere('order.status IN (:...status)', {
                status: [orderStatus.SHOPPING, orderStatus.SHIPPING, orderStatus.ORDERED, orderStatus.COMPLETED],
            })
            .orderBy('fk_User.username');
        if (listOrder === null) {
            throw new BadRequestException(`Orders of User: ${fk_Username} has been removed or invalid!`);
        }
        return paginate<OrderEntity>(listOrder, options);
    }

    async createOrder(orderInfo: createOrderDto) {
        return this.orderRepo.save(orderInfo);
    }

    async orderConfirm(orderInfo: createOrderDto) {
        return this.orderRepo.save(orderInfo);
    }

    async updateOrder(orderInfo: OrderEntity, param: object) {
        for (const key in param) {
            orderInfo[key] = param[key];
        }
        return this.orderRepo.save(orderInfo);
    }
}
