import { PickUpOrderUseCase } from "@/domain/logistics/application/use-cases/pick-up-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Controller, HttpCode, Param, Patch } from "@nestjs/common";
import { resolveUseCase } from "../../helpers/resolve-use-case";

@Controller("/orders/:id/pick-up")
export class PickUpOrderController {
  constructor(private pickUpOrderUseCase: PickUpOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param("id") id: string, @CurrentUser() user: UserPayload) {
    const result = await this.pickUpOrderUseCase.execute({
      actorId: user?.sub,
      orderId: id,
    });

    resolveUseCase(result);
  }
}
