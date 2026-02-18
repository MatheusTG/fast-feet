import { Either, left, right } from "@/core/errors/abstractions/either";
import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { Injectable } from "@nestjs/common";
import { OrdersRepository } from "../repositories/orders-repository";
import { OrderNotFoundError } from "./errors/order-not-found-error";

type DeleteOrderUseCaseRequest = {
  actorId: string | undefined;
  orderId: string;
};

type DeleteOrderUseCaseResponse = Either<
  UnauthorizedError | ForbiddenError | OrderNotFoundError,
  null
>;

@Injectable()
export class DeleteOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private userRoleAuthorizationService: UserRoleAuthorizationService
  ) {}

  async execute(request: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
    const { actorId, orderId } = request;

    const authorization = await this.userRoleAuthorizationService.ensureUserHasRole(
      actorId,
      "ADMIN"
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new OrderNotFoundError("id", orderId));
    }

    await this.ordersRepository.delete(order);

    return right(null);
  }
}
