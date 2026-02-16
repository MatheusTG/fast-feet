import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaRecipientsRepository } from "./prisma/repositories/prisma-recipients-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { RecipientsRepository } from "@/domain/logistics/application/repositories/recipients-repository";

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
  ],
  exports: [PrismaService, UsersRepository, RecipientsRepository],
})
export class DatabaseModule {}
