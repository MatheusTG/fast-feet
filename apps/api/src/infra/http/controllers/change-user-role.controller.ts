import { ChangeUserRoleUseCase } from "@/domain/user/application/use-cases/change-user-role";
import { USER_ROLES } from "@/domain/user/enterprise/entities/user";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Body, Controller, HttpCode, Param, Patch } from "@nestjs/common";
import { z } from "zod";
import { resolveUseCase } from "../helpers/resolve-use-case";
import { ZodValidationsPipe } from "../pipes/zod-validation-pipe";

const ChangeUserRoleBodySchema = z.object({
  role: z.enum(USER_ROLES),
});

const bodyValidationPipe = new ZodValidationsPipe(ChangeUserRoleBodySchema);

type ChangeUserRoleBodySchema = z.infer<typeof ChangeUserRoleBodySchema>;

@Controller("/users/:id/role")
export class ChangeUserRoleController {
  constructor(private changeUserRoleUseCase: ChangeUserRoleUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ChangeUserRoleBodySchema,
    @Param("id") targetUserId: string,
    @CurrentUser() user: UserPayload
  ) {
    const { role } = body;

    resolveUseCase(
      await this.changeUserRoleUseCase.execute({
        actorId: user.sub,
        targetUserId,
        newRole: role,
      })
    );
  }
}
