import { UserRoleAuthorizationService } from "@/domain/user/application/services/user-role-authorization.service";
import { AuthenticateUseCase } from "@/domain/user/application/use-cases/authenticate";
import { FetchUsersUseCase } from "@/domain/user/application/use-cases/fetch-users";
import { RegisterUseCase } from "@/domain/user/application/use-cases/register";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { FetchUsersController } from "./controllers/fetch-users.controller";
import { RegisterController } from "./controllers/register.controller";

const controllerDependencies = [RegisterController, AuthenticateController, FetchUsersController];
const useCasesDependencies = [RegisterUseCase, AuthenticateUseCase, FetchUsersUseCase];
const servicesDependencies = [UserRoleAuthorizationService];

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [...controllerDependencies],
  providers: [...useCasesDependencies, ...servicesDependencies],
})
export class HttpModule {}
