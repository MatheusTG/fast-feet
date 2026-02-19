import {
  OrderFilters,
  OrdersRepository,
} from "@/domain/logistics/application/repositories/orders-repository";
import { Order } from "@/domain/logistics/enterprise/entities/order";
import { Injectable } from "@nestjs/common";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return null;
    }

    return PrismaOrderMapper.toDomain(order);
  }

  async findMany(filters: OrderFilters, params: { page: number }): Promise<Order[]> {
    const where = PrismaOrderMapper.toPrismaWhere(filters);

    const orders = await this.prisma.order.findMany({
      where,
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return orders.map(PrismaOrderMapper.toDomain);
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.create({
      data,
    });
  }

  async update(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.update({
      where: {
        id: order.id.toString(),
      },
      data,
    });
  }

  async assignDeliveryman(orderId: string, deliverymanId: string): Promise<void> {
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        deliverymanId,
        status: "AWAITING_PICKUP",
      },
    });
  }

  async delete(order: Order): Promise<void> {
    await this.prisma.order.delete({
      where: {
        id: order.id.toString(),
      },
    });
  }
}
