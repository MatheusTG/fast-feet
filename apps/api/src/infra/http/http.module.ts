import { UserRoleAuthorizationService } from "@/domain/user/application/services/user-role-authorization.service";
import { AuthenticateUseCase } from "@/domain/user/application/use-cases/authenticate";
import { ChangeUserPasswordUseCase } from "@/domain/user/application/use-cases/change-user-password";
import { ChangeUserRoleUseCase } from "@/domain/user/application/use-cases/change-user-role";
import { DeleteUserUseCase } from "@/domain/user/application/use-cases/delete-user";
import { FetchUsersUseCase } from "@/domain/user/application/use-cases/fetch-users";
import { RegisterUseCase } from "@/domain/user/application/use-cases/register";
import { UpdateUserUseCase } from "@/domain/user/application/use-cases/update-user";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/iam/authenticate.controller";
import { ChangeUserPasswordController } from "./controllers/iam/change-user-password.controller";
import { ChangeUserRoleController } from "./controllers/iam/change-user-role.controller";
import { DeleteUserController } from "./controllers/iam/delete-user.controller";
import { FetchUsersController } from "./controllers/iam/fetch-users.controller";
import { RegisterController } from "./controllers/iam/register.controller";
import { UpdateUserController } from "./controllers/iam/update-user.controller";

const controllerDependencies = [
  RegisterController,
  AuthenticateController,
  FetchUsersController,
  UpdateUserController,
  ChangeUserPasswordController,
  ChangeUserRoleController,
  DeleteUserController,
];
const useCasesDependencies = [
  RegisterUseCase,
  AuthenticateUseCase,
  FetchUsersUseCase,
  UpdateUserUseCase,
  ChangeUserPasswordUseCase,
  ChangeUserRoleUseCase,
  DeleteUserUseCase,
];
const servicesDependencies = [UserRoleAuthorizationService];

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [...controllerDependencies],
  providers: [...useCasesDependencies, ...servicesDependencies],
})
export class HttpModule {}
