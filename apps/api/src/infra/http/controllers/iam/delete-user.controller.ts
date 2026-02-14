import { DeleteUserUseCase } from "@/domain/user/application/use-cases/delete-user";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Controller, Delete, HttpCode, Param } from "@nestjs/common";
import { resolveUseCase } from "../../helpers/resolve-use-case";

@Controller("/users/:id/delete")
export class DeleteUserController {
  constructor(private DeleteUserUseCase: DeleteUserUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") targetUserId: string, @CurrentUser() user: UserPayload) {
    resolveUseCase(
      await this.DeleteUserUseCase.execute({
        actorId: user.sub,
        targetUserId,
      })
    );
  }
}
