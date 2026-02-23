import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Order, OrderProps } from "@/domain/logistics/enterprise/entities/order";
import { PrismaOrderMapper } from "@/infra/database/prisma/mappers/prisma-order-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { makeAddress } from "./make-address";

type Override = Partial<
  Omit<OrderProps, "deliveryAddress"> & {
    deliveryAddress: Partial<OrderProps["deliveryAddress"]>;
  }
>;

export function makeOrder(override?: Override, id?: UniqueEntityId) {
  const { deliveryAddress: addressOverride, recipientId, ...rest } = override ?? {};

  const deliveryAddress = makeAddress(addressOverride);

  const order = Order.create(
    {
      recipientId: recipientId ?? new UniqueEntityId(faker.string.uuid()),
      deliveryAddress,
      status: faker.helpers.arrayElement([
        "PENDING",
        "PICKED_UP",
        "IN_TRANSIT",
        "DELIVERED",
        "RETURNED",
        "CANCELED",
      ]),
      notes: faker.lorem.paragraph(),
      postedAt: faker.helpers.maybe(() => new Date()),
      createdAt: new Date(),
      updatedAt: faker.helpers.maybe(() => new Date()),
      ...rest,
    },
    id
  );

  return order;
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Override = {}): Promise<Order> {
    const order = makeOrder(data);

    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    });

    return order;
  }
}
