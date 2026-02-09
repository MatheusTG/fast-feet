import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env/env";
import { EnvModule } from "./env/env.module";
import { EnvService } from "./env/env.service";
import { AppController } from "./http/controllers/app.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
  ],
  controllers: [AppController],
  providers: [EnvService],
})
export class AppModule {}
