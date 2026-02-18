import { Either, left, right } from "@/core/errors/abstractions/either";
import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { Injectable } from "@nestjs/common";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { RecipientNotFoundError } from "./errors/recipient-not-found-error";

type DeleteRecipientUseCaseRequest = {
  actorId: string | undefined;
  recipientId: string;
};

type DeleteRecipientUseCaseResponse = Either<
  UnauthorizedError | ForbiddenError | RecipientNotFoundError,
  null
>;

@Injectable()
export class DeleteRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private userRoleAuthorizationService: UserRoleAuthorizationService
  ) {}

  async execute(request: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const { actorId, recipientId } = request;

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

    await this.recipientsRepository.delete(recipient);

    return right(null);
  }
}
