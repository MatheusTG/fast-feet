import { AuthenticateUseCase } from "@/domain/user/application/use-cases/authenticate";
import { Public } from "@/infra/auth/public";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { resolveUseCase } from "../helpers/resolve-use-case";
import { ZodValidationsPipe } from "../pipes/zod-validation-pipe";

const authenticateBodySchema = z.object({
  cpf: z.string().regex(/^\d{3}(\.?\d{3}){2}[.-]?\d{2}$/),
  password: z.string().min(6),
});

const bodyValidationPipe = new ZodValidationsPipe(authenticateBodySchema);

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Public()
@Controller("/sessions")
export class AuthenticateController {
  constructor(private authenticateUseCase: AuthenticateUseCase) {}

  @Post()
  @HttpCode(200)
  async handle(@Body(bodyValidationPipe) body: AuthenticateBodySchema) {
    const { cpf, password } = body;

    const result = await this.authenticateUseCase.execute({
      cpf: cpf.replace(/\D/g, ""),
      password,
    });

    const { accessToken } = resolveUseCase(result);

    return {
      access_token: accessToken,
    };
  }
}
