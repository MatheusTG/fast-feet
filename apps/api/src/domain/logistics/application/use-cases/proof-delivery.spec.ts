import { makeOrder } from "@test/factories/make-order";
import { makeUser } from "@test/factories/make-user";
import { InMemoryOrdersRepository } from "@test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { FakeUploader } from "@test/storage/fake-uploader";
import { expect } from "vitest";
import { InvalidProofDeliveryPhotoTypeError } from "./errors/invalid-proof-delivery-photo-type-error";
import { ProofDeliveryUseCase } from "./proof-delivery";

describe("Proof delivery", () => {
  let ordersRepository: InMemoryOrdersRepository;
  let usersRepository: InMemoryUsersRepository;
  let fakeUploader: FakeUploader;

  let sut: ProofDeliveryUseCase;

  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    usersRepository = new InMemoryUsersRepository();
    fakeUploader = new FakeUploader();

    sut = new ProofDeliveryUseCase(ordersRepository, fakeUploader);
  });

  it("should be able to upload a photo to proof a delivery", async () => {
    const user = makeUser({ role: "ADMIN" });
    const order = makeOrder();

    usersRepository.items.push(user);
    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: user.id.toString(),
      orderId: order.id.toString(),
      file: {
        fileName: "profile.png",
        fileType: "image/png",
        body: Buffer.from(""),
      },
    });

    expect(result.isRight()).toBe(true);
    expect(ordersRepository.items[0]).toEqual(
      expect.objectContaining({
        status: "DELIVERED",
        proofOfDeliveryName: "profile.png",
        proofOfDeliveryUrl: expect.any(String),
      })
    );
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "profile.png",
      })
    );
  });

  it("should not be able to upload a photo with invalid file type", async () => {
    const user = makeUser({ role: "ADMIN" });
    const order = makeOrder();

    usersRepository.items.push(user);
    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: user.id.toString(),
      orderId: order.id.toString(),
      file: {
        fileName: "profile.png",
        fileType: "image/mpeg",
        body: Buffer.from(""),
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidProofDeliveryPhotoTypeError);
  });
});
