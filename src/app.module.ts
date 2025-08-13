import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { PgModule } from "./config/pg";
import { PathsModule } from './paths/paths.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["../.env"],
    }),
    PgModule,
    PathsModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
