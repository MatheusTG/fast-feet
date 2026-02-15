import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Recipient, RecipientProps } from "@/domain/logistics/enterprise/entities/recipient";
import { PrismaRecipientMapper } from "@/infra/database/prisma/mappers/prisma-recipient-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { makeAddress } from "./make-address";

type Override = Partial<
  Omit<RecipientProps, "address"> & { address: Partial<RecipientProps["address"]> }
>;

export function makeRecipient(override?: Override, id?: UniqueEntityId) {
  const { address: addressOverride, ...rest } = override ?? {};

  const address = makeAddress(override?.address);

  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      phone: faker.phone.number({ style: "national" }),
      email: faker.internet.email(),
      address: address,
      deliveryInstructions: faker.helpers.maybe(() => faker.lorem.sentence()),
      isProblematic: faker.datatype.boolean(),
      createdAt: new Date(),
      updatedAt: faker.helpers.maybe(() => new Date()),
      ...rest,
    },
    id
  );
  return recipient;
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(data: Partial<RecipientProps> = {}): Promise<Recipient> {
    const recipient = makeRecipient(data);

    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    });

    return recipient;
  }
}
