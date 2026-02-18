import { UniqueEntityId } from "@/core/entities/unique-entity-id";
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
        deliveryAddress: address,

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

      street: order.deliveryAddress.street,
      number: order.deliveryAddress.number,
      neighborhood: order.deliveryAddress.neighborhood,
      complement: order.deliveryAddress.complement,
      city: order.deliveryAddress.city,
      state: order.deliveryAddress.state,
      zipCode: order.deliveryAddress.zipCode,
      latitude: order.deliveryAddress.latitude,
      longitude: order.deliveryAddress.longitude,

      postedAt: order.postedAt,
      pickedUpAt: order.pickedUpAt,
      deliveredAt: order.deliveredAt,
      returnedAt: order.returnedAt,
      canceledAt: order.canceledAt,

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
