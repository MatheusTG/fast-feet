import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { AssignDeliverymanToOrderUseCase } from "@/domain/logistics/application/use-cases/assign-deliveryman-to-order";
import { CreateOrderUseCase } from "@/domain/logistics/application/use-cases/create-order";
import { CreateRecipientUseCase } from "@/domain/logistics/application/use-cases/create-recipient";
import { DeleteOrderUseCase } from "@/domain/logistics/application/use-cases/delete-order";
import { DeleteRecipientUseCase } from "@/domain/logistics/application/use-cases/delete-recipient";
import { FetchOrdersUseCase } from "@/domain/logistics/application/use-cases/fetch-orders";
import { FetchRecipientsUseCase } from "@/domain/logistics/application/use-cases/fetch-recipients";
import { PickUpOrderUseCase } from "@/domain/logistics/application/use-cases/pick-up-order";
import { PublishOrderUseCase } from "@/domain/logistics/application/use-cases/publish-order";
import { UpdateOrderUseCase } from "@/domain/logistics/application/use-cases/update-order";
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
import { AssignDeliverymanController } from "./controllers/logistics/assign-deliveryman.controller";
import { CreateOrderController } from "./controllers/logistics/create-order.controller";
import { CreateRecipientController } from "./controllers/logistics/create-recipient.controller";
import { DeleteOrderController } from "./controllers/logistics/delete-order.controller";
import { DeleteRecipientController } from "./controllers/logistics/delete-recipient.controller";
import { FetchOrdersController } from "./controllers/logistics/fetch-orders.controller";
import { FetchRecipientsController } from "./controllers/logistics/fetch-recipients.controller";
import { PickUpOrderController } from "./controllers/logistics/pick-up-order.controller";
import { PublishOrderController } from "./controllers/logistics/publish-order.controller";
import { UpdateOrderController } from "./controllers/logistics/update-order.controller";
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
  CreateOrderController,
  UpdateOrderController,
  DeleteOrderController,
  FetchOrdersController,
  AssignDeliverymanController,
  PublishOrderController,
  PickUpOrderController,
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
  CreateOrderUseCase,
  UpdateOrderUseCase,
  DeleteOrderUseCase,
  FetchOrdersUseCase,
  AssignDeliverymanToOrderUseCase,
  PublishOrderUseCase,
  PickUpOrderUseCase,
];
const servicesDependencies = [UserRoleAuthorizationService];

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [...controllerDependencies],
  providers: [...useCasesDependencies, ...servicesDependencies],
})
export class HttpModule {}
