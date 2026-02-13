import { UserRoleAuthorizationService } from "@/domain/user/application/services/user-role-authorization.service";
import { AuthenticateUseCase } from "@/domain/user/application/use-cases/authenticate";
import { ChangeUserPasswordUseCase } from "@/domain/user/application/use-cases/change-user-password";
import { FetchUsersUseCase } from "@/domain/user/application/use-cases/fetch-users";
import { RegisterUseCase } from "@/domain/user/application/use-cases/register";
import { UpdateUserUseCase } from "@/domain/user/application/use-cases/update-user";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { ChangeUserPasswordController } from "./controllers/change-user-password.controller";
import { FetchUsersController } from "./controllers/fetch-users.controller";
import { RegisterController } from "./controllers/register.controller";
import { UpdateUserController } from "./controllers/update-user.controller";

const controllerDependencies = [
  RegisterController,
  AuthenticateController,
  FetchUsersController,
  UpdateUserController,
  ChangeUserPasswordController,
];
const useCasesDependencies = [
  RegisterUseCase,
  AuthenticateUseCase,
  FetchUsersUseCase,
  UpdateUserUseCase,
  ChangeUserPasswordUseCase,
];
const servicesDependencies = [UserRoleAuthorizationService];

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [...controllerDependencies],
  providers: [...useCasesDependencies, ...servicesDependencies],
})
export class HttpModule {}
