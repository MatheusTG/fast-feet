import { Either, left, right } from "@/core/errors/abstractions/either";
import { UseCaseError } from "@/core/errors/abstractions/use-case-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { Injectable } from "@nestjs/common";
import { InvalidAddressError } from "../../enterprise/entities/errors/invalid-address-error";
import { Recipient } from "../../enterprise/entities/recipient";
import { RecipientFilters, RecipientsRepository } from "../repositories/recipients-repository";

type FetchRecipientsUseCaseRequest = {
  actorId: string | undefined;
  filters?: RecipientFilters;
  page: number;
};

type FetchRecipientsUseCaseResponse = Either<
  InvalidAddressError | UseCaseError,
  { recipients: Recipient[] }
>;

@Injectable()
export class FetchRecipientsUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private userRoleAuthorizationService: UserRoleAuthorizationService
  ) {}

  async execute(request: FetchRecipientsUseCaseRequest): Promise<FetchRecipientsUseCaseResponse> {
    const { actorId, filters = {}, page } = request;

    const authorization = await this.userRoleAuthorizationService.ensureUserHasRole(
      actorId,
      "ADMIN"
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const recipients = await this.recipientsRepository.findMany(filters, { page });

    return right({
      recipients,
    });
  }
}
