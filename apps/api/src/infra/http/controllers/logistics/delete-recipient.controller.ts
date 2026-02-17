import { DeleteRecipientUseCase } from "@/domain/logistics/application/use-cases/delete-recipient";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Controller, Delete, HttpCode, Param } from "@nestjs/common";
import { resolveUseCase } from "../../helpers/resolve-use-case";

@Controller("/recipients/:id")
export class DeleteRecipientController {
  constructor(private deleteRecipientUseCase: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") recipientId: string, @CurrentUser() user: UserPayload) {
    const result = await this.deleteRecipientUseCase.execute({
      recipientId,
      actorId: user?.sub,
    });

    resolveUseCase(result);
  }
}
