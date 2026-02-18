import { Either, left, right } from "@/core/errors/abstractions/either";
import { UseCaseError } from "@/core/errors/abstractions/use-case-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { Injectable } from "@nestjs/common";
import { InvalidAddressError } from "../../enterprise/entities/errors/invalid-address-error";
import { Order } from "../../enterprise/entities/order";
import { Address } from "../../enterprise/entities/value-objects/address";
import { OrdersRepository } from "../repositories/orders-repository";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { OrderNotFoundError } from "./errors/order-not-found-error";
import { RecipientNotFoundError } from "./errors/recipient-not-found-error";

type CreateOrderUseCaseRequest = {
  actorId: string | undefined;
  order: {
    recipientId: string;
    deliveryAddress: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
      latitude?: number;
      longitude?: number;
    };
    postedAt?: Date;
  };
};

type CreateOrderUseCaseResponse = Either<
  InvalidAddressError | OrderNotFoundError | UseCaseError,
  { order: Order }
>;

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private recipientsRepository: RecipientsRepository,
    private userRoleAuthorizationService: UserRoleAuthorizationService
  ) {}

  async execute(request: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const { actorId, order: orderData } = request;

    const { deliveryAddress: uncheckedAddress, recipientId, ...orderWithoutAddress } = orderData;

    const authorization = await this.userRoleAuthorizationService.ensureUserHasRole(
      actorId,
      "ADMIN"
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const recipient = await this.recipientsRepository.findById(recipientId);

    if (!recipient) {
      return left(new RecipientNotFoundError("recipientId", recipientId));
    }

    const addressOrError = Address.create(uncheckedAddress);

    if (addressOrError.isLeft()) {
      return left(addressOrError.value);
    }

    const address = addressOrError.value;

    const order = Order.create({
      recipientId: recipient.id,
      deliveryAddress: address,
      ...orderWithoutAddress,
    });

    await this.ordersRepository.create(order);

    return right({
      order,
    });
  }
}
