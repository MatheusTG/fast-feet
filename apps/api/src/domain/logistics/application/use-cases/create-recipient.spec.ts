import { makeRecipient } from "@test/factories/make-recipient";
import { InMemoryRecipientsRepository } from "@test/repositories/in-memory-recipients-repository";
import { expect } from "vitest";
import { InvalidAddressError } from "../../enterprise/entities/errors/invalid-address-error";
import { CreateRecipientUseCase } from "./create-recipient";

describe("Create recipient", () => {
  let recipientsRepository: InMemoryRecipientsRepository;

  let sut: CreateRecipientUseCase;

  beforeEach(() => {
    recipientsRepository = new InMemoryRecipientsRepository();

    sut = new CreateRecipientUseCase(recipientsRepository);
  });

  it("should be able to create a recipient", async () => {
    const recipient = makeRecipient();

    const result = await sut.execute(recipient);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ recipient: recipientsRepository.items[0] });
  });

  it("should not be able to create a recipient with an invalid address", async () => {
    const recipient = makeRecipient();

    const result = await sut.execute({
      name: recipient.name,
      phone: recipient.phone,
      email: recipient.email,
      address: {
        street: recipient.address.street,
        number: recipient.address.number,
        complement: recipient.address.complement,
        neighborhood: recipient.address.neighborhood,
        city: recipient.address.city,
        state: recipient.address.state,
        zipCode: recipient.address.zipCode,
        latitude: recipient.address.latitude,
        // longitude is missing to make the address invalid
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAddressError);
  });
});
