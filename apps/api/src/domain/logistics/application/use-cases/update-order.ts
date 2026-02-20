import { Either, left, right } from "@/core/errors/abstractions/either";
import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { Injectable } from "@nestjs/common";
import { InvalidAddressError } from "../../enterprise/entities/errors/invalid-address-error";
import { Order } from "../../enterprise/entities/order";
import { Address } from "../../enterprise/entities/value-objects/address";
import { OrdersRepository } from "../repositories/orders-repository";
import { OrderNotFoundError } from "./errors/order-not-found-error";

type UpdateOrderUseCaseRequest = {
  actorId: string | undefined;
  orderId: string;
  order: {
    deliveryAddress?: {
      street?: string;
      number?: string;
      complement?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      latitude?: number;
      longitude?: number;
    };
    notes: string;
  };
};

type UpdateOrderUseCaseResponse = Either<
  UnauthorizedError | ForbiddenError | InvalidAddressError | OrderNotFoundError,
  { order: Order }
>;

@Injectable()
export class UpdateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private userRoleAuthorizationService: UserRoleAuthorizationService
  ) {}

  async execute(request: UpdateOrderUseCaseRequest): Promise<UpdateOrderUseCaseResponse> {
    const { actorId, orderId, order: orderData } = request;

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

    if (orderData.deliveryAddress) {
      const addressOrError = Address.create({
        street: orderData.deliveryAddress.street ?? order.deliveryAddress.street,
        number: orderData.deliveryAddress.number ?? order.deliveryAddress.number,
        complement: orderData.deliveryAddress.complement ?? order.deliveryAddress.complement,
        neighborhood: orderData.deliveryAddress.neighborhood ?? order.deliveryAddress.neighborhood,
        city: orderData.deliveryAddress.city ?? order.deliveryAddress.city,
        state: orderData.deliveryAddress.state ?? order.deliveryAddress.state,
        zipCode: orderData.deliveryAddress.zipCode ?? order.deliveryAddress.zipCode,
        latitude: orderData.deliveryAddress.latitude ?? order.deliveryAddress.latitude,
        longitude: orderData.deliveryAddress.longitude ?? order.deliveryAddress.longitude,
      });

      if (addressOrError.isLeft()) {
        return left(addressOrError.value);
      }

      order.deliveryAddress = addressOrError.value;
    }

    if (orderData.notes !== undefined) {
      order.notes = orderData.notes;
    }

    await this.ordersRepository.update(order);

    return right({ order });
  }
}
