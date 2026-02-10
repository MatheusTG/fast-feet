import { AuthenticateUseCase } from "@/domain/user/application/use-cases/authenticate";
import { Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";
import { resolveUseCase } from "../helpers/resolve-use-case";
import { ZodValidationsPipe } from "../pipes/zod-validation-pipe";

const authenticateBodySchema = z.object({
  cpf: z.string().regex(/^\d{3}(\.?\d{3}){2}[.-]?\d{2}$/),
  password: z.string().min(6),
});

const bodyValidationPipe = new ZodValidationsPipe(authenticateBodySchema);

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(private authenticateUseCase: AuthenticateUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: AuthenticateBodySchema) {
    const { cpf, password } = body;

    const result = await this.authenticateUseCase.execute({
      cpf,
      password,
    });

    const { accessToken } = resolveUseCase(result);

    return {
      accessToken,
    };
  }
}
