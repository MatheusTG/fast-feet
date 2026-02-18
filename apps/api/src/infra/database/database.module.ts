import { OrdersRepository } from "@/domain/logistics/application/repositories/orders-repository";
import { RecipientsRepository } from "@/domain/logistics/application/repositories/recipients-repository";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaOrdersRepository } from "./prisma/repositories/prisma-orders-repository";
import { PrismaRecipientsRepository } from "./prisma/repositories/prisma-recipients-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";

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
  ],
  exports: [PrismaService, UsersRepository, RecipientsRepository, OrdersRepository],
})
export class DatabaseModule {}
