import { DeleteOrderUseCase } from "@/domain/logistics/application/use-cases/delete-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Controller, Delete, HttpCode, Param } from "@nestjs/common";
import { resolveUseCase } from "../../helpers/resolve-use-case";

@Controller("/orders/:id")
export class DeleteOrderController {
  constructor(private deleteOrderUseCase: DeleteOrderUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") orderId: string, @CurrentUser() user: UserPayload) {
    const result = await this.deleteOrderUseCase.execute({
      orderId,
      actorId: user?.sub,
    });

    resolveUseCase(result);
  }
}
