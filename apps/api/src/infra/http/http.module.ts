import { RegisterUseCase } from "@/domain/user/application/use-cases/register";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { RegisterController } from "./controllers/register.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [RegisterController],
  providers: [RegisterUseCase],
})
export class HttpModule {}
