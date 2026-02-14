import { UpdateUserUseCase } from "@/domain/user/application/use-cases/update-user";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Body, Controller, HttpCode, Param, Patch } from "@nestjs/common";
import { z } from "zod";
import { resolveUseCase } from "../../helpers/resolve-use-case";
import { ZodValidationsPipe } from "../../pipes/zod-validation-pipe";

const UpdateUserBodySchema = z.object({
  cpf: z
    .string()
    .regex(/^\d{3}(\.?\d{3}){2}[.-]?\d{2}$/)
    .optional(),
  name: z.string().optional(),
});

const bodyValidationPipe = new ZodValidationsPipe(UpdateUserBodySchema);

type UpdateUserBodySchema = z.infer<typeof UpdateUserBodySchema>;

@Controller("/users/:id")
export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateUserBodySchema,
    @Param("id") targetUserId: string,
    @CurrentUser() user: UserPayload
  ) {
    const { cpf, name } = body;

    resolveUseCase(
      await this.updateUserUseCase.execute({
        actorId: user.sub,
        targetUserId,
        cpf,
        name,
      })
    );
  }
}
