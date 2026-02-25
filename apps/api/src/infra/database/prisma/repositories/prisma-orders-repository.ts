import { DomainEvents } from "@/core/events/domain-events";
import { LocationParams } from "@/core/repositories/location-params";
import { OrderFilters } from "@/core/repositories/order-filters";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { OrdersRepository } from "@/domain/logistics/application/repositories/orders-repository";
import { Order } from "@/domain/logistics/enterprise/entities/order";
import { Prisma } from "@/generated/prisma/client";
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

  async findMany(
    filters: OrderFilters,
    paginationParams: PaginationParams,
    locationFilters: LocationParams
  ): Promise<Order[]> {
    const { userLatitude, userLongitude, radiusInKm = 10 } = locationFilters;

    let where: Prisma.OrderWhereInput = PrismaOrderMapper.toPrismaWhere(filters);

    if (userLatitude && userLongitude) {
      const latDelta = radiusInKm / 111;

      const lonDelta = radiusInKm / (111 * Math.cos((userLatitude * Math.PI) / 180));

      where = {
        ...where,
        latitude: {
          gte: userLatitude - latDelta,
          lte: userLatitude + latDelta,
        },
        longitude: {
          gte: userLongitude - lonDelta,
          lte: userLongitude + lonDelta,
        },
      };
    }

    const orders = await this.prisma.order.findMany({
      where,
      take: 20,
      skip: (paginationParams.page - 1) * 20,
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

    if (data.status) {
      DomainEvents.dispatchEventsForAggregate(order.id);
    }

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
