import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { OrderFilters } from "@/core/repositories/order-filters";
import { Order } from "@/domain/logistics/enterprise/entities/order";
import { Address } from "@/domain/logistics/enterprise/entities/value-objects/address";
import { Prisma, Order as PrismaOrder } from "@/generated/prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    const addressOrError = Address.create({
      street: raw.street,
      number: raw.number,
      neighborhood: raw.neighborhood,
      complement: raw.complement ?? undefined,
      city: raw.city,
      state: raw.state,
      zipCode: raw.zipCode,
      latitude: raw.latitude ?? undefined,
      longitude: raw.longitude ?? undefined,
    });

    if (addressOrError.isLeft()) {
      throw new Error(`Invalid address stored in database!`);
    }

    const address = addressOrError.value;

    return Order.create(
      {
        recipientId: new UniqueEntityId(raw.recipientId),
        deliverymanId: raw.deliverymanId ? new UniqueEntityId(raw.deliverymanId) : undefined,
        status: raw.status,
        proofOfDeliveryName: raw.proofOfDeliveryName ?? undefined,
        proofOfDeliveryUrl: raw.proofOfDeliveryName ?? undefined,

        deliveryAddress: address,

        notes: raw.notes ?? undefined,

        postedAt: raw.postedAt,
        pickedUpAt: raw.pickedUpAt ?? undefined,
        deliveredAt: raw.deliveredAt ?? undefined,
        returnedAt: raw.returnedAt ?? undefined,
        canceledAt: raw.canceledAt ?? undefined,

        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      deliverymanId: order.deliverymanId?.toString(),

      status: order.status,
      proofOfDeliveryName: order.proofOfDeliveryName,
      proofOfDeliveryUrl: order.proofOfDeliveryName,

      street: order.deliveryAddress.street,
      number: order.deliveryAddress.number,
      neighborhood: order.deliveryAddress.neighborhood,
      complement: order.deliveryAddress.complement,
      city: order.deliveryAddress.city,
      state: order.deliveryAddress.state,
      zipCode: order.deliveryAddress.zipCode,
      latitude: order.deliveryAddress.latitude,
      longitude: order.deliveryAddress.longitude,

      notes: order.notes,

      postedAt: order.postedAt,
      pickedUpAt: order.pickedUpAt,
      deliveredAt: order.deliveredAt,
      returnedAt: order.returnedAt,
      canceledAt: order.canceledAt,

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  static toPrismaWhere(filters: OrderFilters): Prisma.OrderWhereInput {
    const where: Prisma.OrderWhereInput = {};

    if (filters.recipientId) {
      where.recipientId = filters.recipientId;
    }

    if (filters.deliverymanId) {
      where.deliverymanId = filters.deliverymanId;
    }

    if (filters.status) {
      where.status = filters.status as any;
    }

    // createdAt
    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {};

      if (filters.createdAfter) {
        where.createdAt.gte = filters.createdAfter;
      }

      if (filters.createdBefore) {
        where.createdAt.lte = filters.createdBefore;
      }
    }

    // postedAt
    if (filters.postedAfter || filters.postedBefore) {
      where.postedAt = {};

      if (filters.postedAfter) {
        where.postedAt.gte = filters.postedAfter;
      }

      if (filters.postedBefore) {
        where.postedAt.lte = filters.postedBefore;
      }
    }

    // deliveredAt
    if (filters.deliveredAfter || filters.deliveredBefore) {
      where.deliveredAt = {};

      if (filters.deliveredAfter) {
        where.deliveredAt.gte = filters.deliveredAfter;
      }

      if (filters.deliveredBefore) {
        where.deliveredAt.lte = filters.deliveredBefore;
      }
    }

    return where;
  }
}
