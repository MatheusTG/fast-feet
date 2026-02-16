import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { RecipientFilters } from "@/domain/logistics/application/repositories/recipients-repository";
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";
import { Address } from "@/domain/logistics/enterprise/entities/value-objects/address";
import { Prisma, Recipient as PrismaRecipient } from "@/generated/prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
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

    return Recipient.create(
      {
        name: raw.name,
        phone: raw.phone,
        email: raw.email,
        address,
        deliveryInstructions: raw.deliveryInstructions ?? undefined,
        isProblematic: raw.isProblematic,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      phone: recipient.phone,
      email: recipient.email,
      street: recipient.address.street,
      number: recipient.address.number,
      neighborhood: recipient.address.neighborhood,
      complement: recipient.address.complement,
      city: recipient.address.city,
      state: recipient.address.state,
      zipCode: recipient.address.zipCode,
      latitude: recipient.address.latitude,
      longitude: recipient.address.longitude,
      deliveryInstructions: recipient.deliveryInstructions,
      isProblematic: recipient.isProblematic,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    };
  }

  static toPrismaWhere(filters: RecipientFilters): Prisma.RecipientWhereInput {
    const where: Prisma.RecipientWhereInput = {};

    if (filters.name) {
      where.name = {
        contains: filters.name,
        mode: "insensitive",
      };
    }

    if (filters.email) {
      where.email = {
        contains: filters.email,
        mode: "insensitive",
      };
    }

    if (filters.phone) {
      where.phone = {
        contains: filters.phone,
      };
    }

    if (filters.city) {
      where.city = {
        equals: filters.city,
        mode: "insensitive",
      };
    }

    if (filters.state) {
      where.state = filters.state;
    }

    if (filters.isProblematic !== undefined) {
      where.isProblematic = filters.isProblematic;
    }

    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {};

      if (filters.createdAfter) {
        where.createdAt.gte = filters.createdAfter;
      }

      if (filters.createdBefore) {
        where.createdAt.lte = filters.createdBefore;
      }
    }

    return where;
  }
}
