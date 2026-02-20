import { ProofDeliveryUseCase } from "@/domain/logistics/application/use-cases/proof-delivery";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { resolveUseCase } from "../../helpers/resolve-use-case";

@Controller("/orders/:orderId/proof-of-delivery")
export class ProofDeliveryController {
  constructor(private proofDeliveryUseCase: ProofDeliveryUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("orderId") orderId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
          new FileTypeValidator({
            fileType: ".(png|jpg|jpeg|pdf)",
          }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    const result = await this.proofDeliveryUseCase.execute({
      actorId: user.sub,
      orderId,
      file: {
        fileName: file.originalname,
        fileType: file.mimetype,
        body: file.buffer,
      },
    });

    const { order } = resolveUseCase(result);

    return {
      orderId: order.id.toString(),
      proofOfDeliveryUrl: order.proofOfDeliveryUrl,
    };
  }
}
