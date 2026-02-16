import {
  RecipientFilters,
  RecipientsRepository,
} from "@/domain/logistics/application/repositories/recipients-repository";
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";
import { Injectable } from "@nestjs/common";
import { PrismaRecipientMapper } from "../mappers/prisma-recipient-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.create({
      data,
    });
  }

  async findMany(filters: RecipientFilters, params: { page: number }): Promise<Recipient[]> {
    const where = PrismaRecipientMapper.toPrismaWhere(filters);

    const recipients = await this.prisma.recipient.findMany({
      where,
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return recipients.map(PrismaRecipientMapper.toDomain);
  }
}
