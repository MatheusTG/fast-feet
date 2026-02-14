import { Either, left, right } from "@/core/errors/abstractions/either";
import { UseCaseError } from "@/core/errors/abstractions/use-case-error";
import { Injectable } from "@nestjs/common";
import { InvalidAddressError } from "../../enterprise/entities/errors/invalid-address-error";
import { Recipient } from "../../enterprise/entities/recipient";
import { Address } from "../../enterprise/entities/value-objects/address";
import { RecipientsRepository } from "../repositories/recipients-repository";

type CreateRecipientUseCaseRequest = {
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

type CreateRecipientUseCaseResponse = Either<
  InvalidAddressError | UseCaseError,
  { recipient: Recipient }
>;

@Injectable()
export class CreateRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute(request: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const { address: uncheckedAddress, ...recipientData } = request;

    const addressOrError = Address.create(uncheckedAddress);

    if (addressOrError.isLeft()) {
      return left(addressOrError.value);
    }

    const address = addressOrError.value;

    const recipient = Recipient.create({
      ...recipientData,
      address,
    });

    await this.recipientsRepository.create(recipient);

    return right({
      recipient,
    });
  }
}
