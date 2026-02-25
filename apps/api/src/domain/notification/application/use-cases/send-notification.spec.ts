import { makeRecipient } from "@test/factories/make-recipient";
import { FakeEmailSender } from "@test/mail/fake-email-sender";
import { InMemoryNotificationsRepository } from "@test/repositories/in-memory-notifications.repository";
import { InMemoryRecipientsRepository } from "@test/repositories/in-memory-recipients-repository";
import { SendNotificationUseCase } from "./send-notification";

describe("Send Notification", () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
  let inMemoryRecipientRepository: InMemoryRecipientsRepository;
  let fakeEmailSender: FakeEmailSender;

  let sut: SendNotificationUseCase;

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    inMemoryRecipientRepository = new InMemoryRecipientsRepository();
    fakeEmailSender = new FakeEmailSender();

    sut = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
      inMemoryRecipientRepository,
      fakeEmailSender
    );
  });

  it("should be able to send a notification", async () => {
    const recipient = makeRecipient();

    await inMemoryRecipientRepository.create(recipient);

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      title: "New Notification",
      content: "Notification content",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.isRight() && result.value?.notification
    );
    expect(fakeEmailSender.sentEmails).toHaveLength(1);
  });
});
