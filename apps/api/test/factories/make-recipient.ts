import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Recipient, RecipientProps } from "@/domain/logistics/enterprise/entities/recipient";
import { Address } from "@/domain/logistics/enterprise/entities/value-objects/address";
import { PrismaRecipientMapper } from "@/infra/database/prisma/mappers/prisma-recipient-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeRecipient(override?: Partial<RecipientProps>, id?: UniqueEntityId) {
  const uncheckedAddress = {
    street: faker.location.street(),
    number: faker.location.buildingNumber(),
    complement: faker.helpers.maybe(() => faker.location.secondaryAddress()),
    neighborhood: faker.location.county(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode("#####-###"),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    ...override?.address,
  };

  const addressOrError = Address.create(uncheckedAddress);

  if (addressOrError.isLeft()) {
    throw new Error(`Test setup failed: generated invalid address (${uncheckedAddress})`);
  }

  const address = addressOrError.value;

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
      ...override,
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
