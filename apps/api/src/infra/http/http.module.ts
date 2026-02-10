import { AuthenticateUseCase } from "@/domain/user/application/use-cases/authenticate";
import { RegisterUseCase } from "@/domain/user/application/use-cases/register";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { RegisterController } from "./controllers/register.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [RegisterController, AuthenticateController],
  providers: [RegisterUseCase, AuthenticateUseCase],
})
export class HttpModule {}
