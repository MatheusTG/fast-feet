import { OrdersRepository } from "@/domain/logistics/application/repositories/orders-repository";
import { RecipientsRepository } from "@/domain/logistics/application/repositories/recipients-repository";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notifications-repository";
import { PrismaOrdersRepository } from "./prisma/repositories/prisma-orders-repository";
import { PrismaRecipientsRepository } from "./prisma/repositories/prisma-recipients-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    RecipientsRepository,
    OrdersRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
