import { RecipientsRepository } from "@/domain/logistics/application/repositories/recipients-repository";
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";
import { PrismaRecipientMapper } from "../mappers/prisma-recipient-mapper";
import { PrismaService } from "../prisma.service";

export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.create({
      data,
    });
  }
}
