import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { CreateRecipientUseCase } from "@/domain/logistics/application/use-cases/create-recipient";
import { DeleteRecipientUseCase } from "@/domain/logistics/application/use-cases/delete-recipient";
import { FetchRecipientsUseCase } from "@/domain/logistics/application/use-cases/fetch-recipients";
import { UpdateRecipientUseCase } from "@/domain/logistics/application/use-cases/update-recipient";
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
import { CreateRecipientController } from "./controllers/logistics/create-recipient.controller";
import { DeleteRecipientController } from "./controllers/logistics/delete-recipient.controller";
import { FetchRecipientsController } from "./controllers/logistics/fetch-recipients.controller";
import { UpdateRecipientController } from "./controllers/logistics/update-recipient.controller";

const controllerDependencies = [
  // IAM
  RegisterController,
  AuthenticateController,
  FetchUsersController,
  UpdateUserController,
  ChangeUserPasswordController,
  ChangeUserRoleController,
  DeleteUserController,

  // Logistics
  CreateRecipientController,
  FetchRecipientsController,
  UpdateRecipientController,
  DeleteRecipientController,
];
const useCasesDependencies = [
  // IAM
  RegisterUseCase,
  AuthenticateUseCase,
  FetchUsersUseCase,
  UpdateUserUseCase,
  ChangeUserPasswordUseCase,
  ChangeUserRoleUseCase,
  DeleteUserUseCase,

  // Logistics
  CreateRecipientUseCase,
  FetchRecipientsUseCase,
  UpdateRecipientUseCase,
  DeleteRecipientUseCase,
];
const servicesDependencies = [UserRoleAuthorizationService];

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [...controllerDependencies],
  providers: [...useCasesDependencies, ...servicesDependencies],
})
export class HttpModule {}
