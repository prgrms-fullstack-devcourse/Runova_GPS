import { Global, Module } from "@nestjs/common";
import { PG_CLIENT } from "./token";
import { pgClientFactory } from "./pg.client.factory";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
    providers: [
        {
            provide: PG_CLIENT,
            useFactory: pgClientFactory,
            inject: [ConfigService],
        }
    ],
    exports: [PG_CLIENT],
})
export class PgModule {}