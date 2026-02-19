import { PublishOrderUseCase } from "@/domain/logistics/application/use-cases/publish-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Controller, Param, Patch } from "@nestjs/common";
import { resolveUseCase } from "../../helpers/resolve-use-case";

@Controller("/orders/:id/publish")
export class PublishOrderController {
  constructor(private useCase: PublishOrderUseCase) {}

  @Patch()
  async handle(@Param("id") orderId: string, @CurrentUser() user: UserPayload) {
    const result = await this.useCase.execute({
      actorId: user.sub,
      orderId,
    });

    resolveUseCase(result);
  }
}
