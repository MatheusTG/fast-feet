import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { makeOrder } from "@test/factories/make-order";
import { makeUser } from "@test/factories/make-user";
import { InMemoryOrdersRepository } from "@test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { FakeUploader } from "@test/storage/fake-uploader";
import { expect } from "vitest";
import { InvalidProofDeliveryPhotoTypeError } from "./errors/invalid-proof-delivery-photo-type-error";
import { OrderNotFoundError } from "./errors/order-not-found-error";
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
    const deliveryman = makeUser({ role: "DELIVERYMAN" });
    const order = makeOrder({
      deliverymanId: deliveryman.id,
    });

    usersRepository.items.push(deliveryman);
    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: deliveryman.id.toString(),
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

  it("should not upload proof delivery if user is not authenticated", async () => {
    const order = makeOrder();
    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: undefined,
      orderId: order.id.toString(),
      file: {
        fileName: "proof.png",
        fileType: "image/png",
        body: Buffer.from(""),
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UnauthorizedError);
  });

  it("should not upload proof delivery if order does not exist", async () => {
    const deliveryman = makeUser();

    const result = await sut.execute({
      actorId: deliveryman.id.toString(),
      orderId: "non-existing-id",
      file: {
        fileName: "proof.png",
        fileType: "image/png",
        body: Buffer.from(""),
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(OrderNotFoundError);
  });

  it("should not upload file if deliveryman is invalid", async () => {
    const deliveryman = makeUser();
    const otherUser = makeUser();

    const order = makeOrder({
      deliverymanId: deliveryman.id,
    });

    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: otherUser.id.toString(),
      orderId: order.id.toString(),
      file: {
        fileName: "proof.png",
        fileType: "image/png",
        body: Buffer.from(""),
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(fakeUploader.uploads).toHaveLength(0);
  });
});
