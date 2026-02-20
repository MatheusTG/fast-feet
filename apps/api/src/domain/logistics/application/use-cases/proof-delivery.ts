import { Either, left, right } from "@/core/errors/abstractions/either";
import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { Injectable } from "@nestjs/common";
import { Order } from "../../enterprise/entities/order";
import { OrdersRepository } from "../repositories/orders-repository";
import { Uploader } from "../storage/uploader";
import { InvalidProofDeliveryPhotoTypeError } from "./errors/invalid-proof-delivery-photo-type-error";
import { OrderNotFoundError } from "./errors/order-not-found-error";

type ProofDeliveryUseCaseRequest = {
  actorId: string | undefined;
  orderId: string;
  file: {
    fileName: string;
    fileType: string;
    body: Buffer;
  };
};

type ProofDeliveryUseCaseResponse = Either<
  InvalidProofDeliveryPhotoTypeError | OrderNotFoundError | UnauthorizedError | ForbiddenError,
  { order: Order }
>;

@Injectable()
export class ProofDeliveryUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private userRoleAuthorizationService: UserRoleAuthorizationService,
    private uploader: Uploader
  ) {}

  async execute(request: ProofDeliveryUseCaseRequest): Promise<ProofDeliveryUseCaseResponse> {
    const { actorId, orderId, file } = request;

    if (!/^(image\/(jpeg|png))$|^aplication\/pdf$/.test(file.fileType)) {
      return left(new InvalidProofDeliveryPhotoTypeError(file.fileType));
    }

    const { url } = await this.uploader.upload(file);

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

    order.deliver(file.fileName, url);

    await this.ordersRepository.update(order);

    return right({
      order,
    });
  }
}
