import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaNotificationMapper } from "../mappers/prisma-notification-mapper";

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Notification | null> {
    const notifications = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    });

    if (!notifications) {
      return null;
    }

    return PrismaNotificationMapper.toDomain(notifications);
  }

  async save(notifications: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notifications);

    await this.prisma.notification.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await this.prisma.notification.create({
      data,
    });
  }
}
