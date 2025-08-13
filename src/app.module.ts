import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CoursesModule } from './courses/courses.module';
import { RedisModule } from "./config/redis";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeormDataSourceFactory, typeormOptionsFactory } from "./config/typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["../.env"],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeormOptionsFactory,
      dataSourceFactory: typeormDataSourceFactory,
      inject: [ConfigService],
    }),
    RedisModule,
    CoursesModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
