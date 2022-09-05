import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { orderShipment, orderStatus } from 'src/commons/common.enum';
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

  async addProductToOrder(
    orderProductInfo: createOrderProductDto,
    username: string,
  ): Promise<OrderProductEntity> {
    /*
    Check valid fk_Order
    */
    const orderInfo = await this.orderService.getOrderByIdAndUsername(
      orderProductInfo.fk_Order.toString(),
      username,
    );
    if (orderInfo.status !== orderStatus.SHOPPING) {
      throw new HttpException(
        'Can not change the order!',
        HttpStatus.BAD_REQUEST,
      );
    }
    /*
    Check valid fk_Product
    */
    const productInfo = await this.checkProductExist(
      orderProductInfo.fk_Product,
    );
    /*
    Check orderProduct exist
    */
    const listOrderProduct = await this.getListProductByOrderId(
      orderProductInfo.fk_Order.toString(),
      username,
    );
    for (const orderProduct of listOrderProduct) {
      if (
        Number(orderProduct.fk_Product.id) ===
        Number(orderProductInfo.fk_Product)
      ) {
        /*
        Check qty after change
        */
        const productQty = await this.checkQtyRemain(
          productInfo,
          Number(orderProductInfo.qty) + Number(orderProduct.qty),
        );

        if (productQty > Number(productInfo.qtyRemaining)) {
          throw new HttpException(
            'Your order quantities is higher than quantity in stock!',
            HttpStatus.BAD_REQUEST,
          );
        }
        orderProduct.qty = productQty.toString();
        orderProduct.totalPrice = orderProduct.price * productQty;
        // const newOrderProductPrice = orderProduct.price * orderQty;
        orderInfo.totalProductPrice += orderProduct.totalPrice;
        orderInfo.totalOrderPrice += orderProduct.totalPrice;
        await this.orderService.createOrder(orderInfo);
        return this.orderProductRepo.addProductToOrder(orderProduct);
      }
    }
    /*
    Check qty input
    */
    const orderQty = await this.checkQtyRemain(
      productInfo,
      Number(orderProductInfo.qty),
    );
    /*
    OrderProduct not exist
    */
    orderProductInfo.qty = orderQty.toString();
    orderProductInfo.price = Number(productInfo.netPrice);
    if (orderInfo.shipment === orderShipment.GHN) {
      orderInfo.shipmentPrice = 30000;
    } else {
      orderInfo.shipmentPrice = 35000;
    }
    orderProductInfo.totalPrice = orderProductInfo.price * orderQty;
    orderInfo.totalProductPrice = orderProductInfo.totalPrice;
    orderInfo.totalOrderPrice =
      orderInfo.totalProductPrice + orderInfo.shipmentPrice;
    await this.orderService.createOrder(orderInfo);
    return this.orderProductRepo.addProductToOrder(orderProductInfo);
  }

  async getListProductByOrderId(
    orderId: string,
    username: string,
  ): Promise<OrderProductEntity[]> {
    await this.orderService.getOrderByIdAndUsername(orderId, username);
    return this.orderProductRepo.getListProductByOrderId(orderId);
  }

  async adminGetListProductByOrderId(
    orderId: string,
  ): Promise<OrderProductEntity[]> {
    const listProduct = await this.orderProductRepo.getListProductByOrderId(
      orderId,
    );
    if (listProduct.length === 0) {
      throw new HttpException('The order is empty!', HttpStatus.BAD_REQUEST);
    }
    return listProduct;
  }

  async updateProductInOrder(
    orderProductId: string,
    newQty: string,
    username: string,
  ) {
    const orderProductInfo = await this.orderProductRepo.showOrderProduct(
      orderProductId,
    );
    if (orderProductInfo === null) {
      throw new HttpException(
        'OrderProductID is invalid!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const productInfo = await this.checkProductExist(
      orderProductInfo.fk_Product.id,
    );
    await this.checkQtyRemain(productInfo, Number(newQty));
    const orderInfo = await this.orderService.getOrderByIdAndUsername(
      orderProductInfo.fk_Order.id,
      username,
    );
    const oldTotalPrice = orderProductInfo.totalPrice;
    /*
      Save new Data to OrderProductTable
    */
    orderProductInfo.qty = newQty;
    orderProductInfo.totalPrice = Number(newQty) * orderProductInfo.price;
    await this.orderProductRepo.addProductToOrder(orderProductInfo);
    /*
      Save new Data to OrderTable
    */
    orderInfo.totalProductPrice =
      orderInfo.totalProductPrice - oldTotalPrice + orderProductInfo.totalPrice;
    return this.orderService.createOrder(orderInfo);
  }

  async checkProductExist(productId): Promise<ProductEntity> {
    const productInfo = await this.productRepo.showProductByProductId({
      id: productId,
    });
    if (productInfo === null) {
      throw new HttpException('ProductID is invalid!', HttpStatus.BAD_REQUEST);
    }
    return productInfo;
  }

  async checkQtyRemain(productInfo: ProductEntity, orderQty: number) {
    if (orderQty > Number(productInfo.qtyRemaining)) {
      throw new HttpException(
        'Your order quantities is higher than quantity in stock!',
        HttpStatus.BAD_REQUEST,
      );
    } else if (orderQty === 0) {
      throw new HttpException(
        'The minimum of order quantity is 1!',
        HttpStatus.BAD_REQUEST,
      );
    } else if (orderQty < 0) {
      throw new HttpException(
        'Product qty can not smaller than 0!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return orderQty;
  }

  async deleteProductInOrder(orderProductId: string, username: string) {
    const orderProductInfo = await this.orderProductRepo.showOrderProduct(
      orderProductId,
    );
    if (orderProductInfo === null) {
      throw new HttpException(
        'OrderProductID is invalid!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const orderInfo = await this.orderService.getOrderByIdAndUsername(
      orderProductInfo.fk_Order.id,
      username,
    );
    orderInfo.totalProductPrice -= orderProductInfo.totalPrice;
    if (orderInfo.fk_OrderProduct === undefined) {
      throw new HttpException('List order-product is empty!', HttpStatus.OK);
    }
    await this.orderService.createOrder(orderInfo);
    this.orderProductRepo.deleteProductInOrder(orderProductId);
    return 'Delete successful!';
  }
}
