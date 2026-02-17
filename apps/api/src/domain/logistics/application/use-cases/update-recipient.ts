import { Either, left, right } from "@/core/errors/abstractions/either";
import { UseCaseError } from "@/core/errors/abstractions/use-case-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { Injectable } from "@nestjs/common";
import { InvalidAddressError } from "../../enterprise/entities/errors/invalid-address-error";
import { Recipient } from "../../enterprise/entities/recipient";
import { Address } from "../../enterprise/entities/value-objects/address";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { RecipientNotFoundError } from "./errors/recipient-not-found.error";

type UpdateRecipientUseCaseRequest = {
  actorId: string | undefined;
  recipientId: string;
  recipient: {
    name?: string;
    phone?: string;
    email?: string;
    address?: {
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
    deliveryInstructions?: string;
    isProblematic?: boolean;
  };
};

type UpdateRecipientUseCaseResponse = Either<
  InvalidAddressError | UseCaseError,
  { recipient: Recipient }
>;

@Injectable()
export class UpdateRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private userRoleAuthorizationService: UserRoleAuthorizationService
  ) {}

  async execute(request: UpdateRecipientUseCaseRequest): Promise<UpdateRecipientUseCaseResponse> {
    const { actorId, recipientId, recipient: recipientData } = request;

    const authorization = await this.userRoleAuthorizationService.ensureUserHasRole(
      actorId,
      "ADMIN"
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const recipient = await this.recipientsRepository.findById(recipientId);

    if (!recipient) {
      return left(new RecipientNotFoundError("id", recipientId));
    }

    if (recipientData.address) {
      const addressOrError = Address.create({
        street: recipientData.address.street ?? recipient.address.street,
        number: recipientData.address.number ?? recipient.address.number,
        complement: recipientData.address.complement ?? recipient.address.complement,
        neighborhood: recipientData.address.neighborhood ?? recipient.address.neighborhood,
        city: recipientData.address.city ?? recipient.address.city,
        state: recipientData.address.state ?? recipient.address.state,
        zipCode: recipientData.address.zipCode ?? recipient.address.zipCode,
        latitude: recipientData.address.latitude ?? recipient.address.latitude,
        longitude: recipientData.address.longitude ?? recipient.address.longitude,
      });

      if (addressOrError.isLeft()) {
        return left(addressOrError.value);
      }

      recipient.address = addressOrError.value;
    }

    if (recipientData.name !== undefined) {
      recipient.name = recipientData.name;
    }

    if (recipientData.phone !== undefined) {
      recipient.phone = recipientData.phone;
    }

    if (recipientData.email !== undefined) {
      recipient.email = recipientData.email;
    }

    if (recipientData.deliveryInstructions !== undefined) {
      recipient.deliveryInstructions = recipientData.deliveryInstructions;
    }

    if (recipientData.isProblematic !== undefined) {
      recipient.isProblematic = recipientData.isProblematic;
    }

    await this.recipientsRepository.update(recipient);

    return right({
      recipient,
    });
  }
}
