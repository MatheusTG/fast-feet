import { makeOrder } from "@test/factories/make-order";
import { InMemoryNotificationsRepository } from "@test/repositories/in-memory-notifications.repository";
import { InMemoryOrdersRepository } from "@test/repositories/in-memory-orders-repository";
import { MockInstance } from "vitest";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { OnOrderStatusChanged } from "./on-order-status-changed";

describe("On order status changed", () => {
  let inMemoryOrdersRepository: InMemoryOrdersRepository;
  let notificationsRepository: InMemoryNotificationsRepository;
  let sendNotification: SendNotificationUseCase;

  let sendNotificationExecuteSpy: MockInstance<
    (request: SendNotificationUseCaseRequest) => Promise<SendNotificationUseCaseResponse>
  >;

  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    notificationsRepository = new InMemoryNotificationsRepository();
    sendNotification = new SendNotificationUseCase(notificationsRepository);

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, "execute");

    new OnOrderStatusChanged(sendNotification);
  });

  it("should send a notification when the order status is changed", async () => {
    const order = makeOrder();
    order.markAsAvailable();

    await inMemoryOrdersRepository.update(order);

    await vi.waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled());
  });
});
