import { Either, left, right } from "@/core/errors/abstractions/either";
import { UseCaseError } from "@/core/errors/abstractions/use-case-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { Injectable } from "@nestjs/common";
import { InvalidAddressError } from "../../enterprise/entities/errors/invalid-address-error";
import { Recipient } from "../../enterprise/entities/recipient";
import { Address } from "../../enterprise/entities/value-objects/address";
import { RecipientsRepository } from "../repositories/recipients-repository";

type CreateRecipientUseCaseRequest = {
  actorId: string | undefined;
  recipient: {
    name: string;
    phone: string;
    email: string;
    address: {
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
    deliveryInstructions?: string;
    isProblematic?: boolean;
  };
};

type CreateRecipientUseCaseResponse = Either<
  InvalidAddressError | UseCaseError,
  { recipient: Recipient }
>;

@Injectable()
export class CreateRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private userRoleAuthorizationService: UserRoleAuthorizationService
  ) {}

  async execute(request: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const { actorId, recipient: recipientData } = request;

    const { address: uncheckedAddress, ...recipientWithoutAddress } = recipientData;

    const authorization = await this.userRoleAuthorizationService.ensureUserHasRole(
      actorId,
      "ADMIN"
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const addressOrError = Address.create(uncheckedAddress);

    if (addressOrError.isLeft()) {
      return left(addressOrError.value);
    }

    const address = addressOrError.value;

    const recipient = Recipient.create({
      ...recipientWithoutAddress,
      address,
    });

    await this.recipientsRepository.create(recipient);

    return right({
      recipient,
    });
  }
}
