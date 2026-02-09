import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [PrismaService, UsersRepository],
})
export class DatabaseModule {}
