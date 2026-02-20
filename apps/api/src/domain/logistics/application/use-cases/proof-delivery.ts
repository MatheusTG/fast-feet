import { Either, left, right } from "@/core/errors/abstractions/either";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { Injectable } from "@nestjs/common";
import { Order } from "../../enterprise/entities/order";
import { OrdersRepository } from "../repositories/orders-repository";
import { Uploader } from "../storage/uploader";
import { InvalidProofDeliveryPhotoTypeError } from "./errors/invalid-proof-delivery-photo-type-error";
import { NotAllowedDeliverymanError } from "./errors/not-allowed-deliveryman-error";
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
  | InvalidProofDeliveryPhotoTypeError
  | OrderNotFoundError
  | UnauthorizedError
  | NotAllowedDeliverymanError,
  { order: Order }
>;

@Injectable()
export class ProofDeliveryUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private uploader: Uploader
  ) {}

  async execute(request: ProofDeliveryUseCaseRequest): Promise<ProofDeliveryUseCaseResponse> {
    const { actorId, orderId, file } = request;

    if (!/^(image\/(jpeg|png))$|^aplication\/pdf$/.test(file.fileType)) {
      return left(new InvalidProofDeliveryPhotoTypeError(file.fileType));
    }

    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new OrderNotFoundError("id", orderId));
    }

    if (!actorId) {
      return left(new UnauthorizedError());
    }

    if (actorId !== order?.deliverymanId?.toString()) {
      return left(new NotAllowedDeliverymanError(actorId));
    }

    const { url } = await this.uploader.upload(file);
    order.deliver(file.fileName, url);

    await this.ordersRepository.update(order);

    return right({
      order,
    });
  }
}
