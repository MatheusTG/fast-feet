import { ChangeUserPasswordUseCase } from "@/domain/user/application/use-cases/change-user-password";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Body, Controller, HttpCode, Param, Patch } from "@nestjs/common";
import { z } from "zod";
import { resolveUseCase } from "../../helpers/resolve-use-case";
import { ZodValidationsPipe } from "../../pipes/zod-validation-pipe";

const ChangeUserPasswordBodySchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});

const bodyValidationPipe = new ZodValidationsPipe(ChangeUserPasswordBodySchema);

type ChangeUserPasswordBodySchema = z.infer<typeof ChangeUserPasswordBodySchema>;

@Controller("/users/:id/password")
export class ChangeUserPasswordController {
  constructor(private changeUserPasswordUseCase: ChangeUserPasswordUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ChangeUserPasswordBodySchema,
    @Param("id") targetUserId: string,
    @CurrentUser() user: UserPayload
  ) {
    const { currentPassword, newPassword } = body;

    resolveUseCase(
      await this.changeUserPasswordUseCase.execute({
        actorId: user.sub,
        targetUserId,
        currentPassword,
        newPassword,
      })
    );
  }
}
