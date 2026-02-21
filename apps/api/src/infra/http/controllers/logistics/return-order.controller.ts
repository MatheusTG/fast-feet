import { ReturnOrderUseCase } from "@/domain/logistics/application/use-cases/return-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Controller, HttpCode, Param, Patch } from "@nestjs/common";
import { resolveUseCase } from "../../helpers/resolve-use-case";

@Controller("/orders/:id/return")
export class ReturnOrderController {
  constructor(private returnOrderUseCase: ReturnOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param("id") id: string, @CurrentUser() user: UserPayload) {
    const result = await this.returnOrderUseCase.execute({
      actorId: user?.sub,
      orderId: id,
    });

    resolveUseCase(result);
  }
}
