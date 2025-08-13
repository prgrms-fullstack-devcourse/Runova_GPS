import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as fs from "node:fs";

export function typeormOptionsFactory(config: ConfigService): TypeOrmModuleOptions {
    const ca = config.get<string>("DB_SSL_CA");

    const ssl = ca ? {
                ca: fs.readFileSync(ca).toString(),
                rejectUnauthorized: true,
            } : false;

    return {
        type: config.get<any>("DB_TYPE"),
        host: config.get<string>("DB_HOST")!,
        port: config.get<number>("DB_PORT")!,
        username: config.get<string>("DB_USERNAME")!,
        password: config.get<string>("DB_PASSWORD")!,
        database: config.get<string>("DB_DATABASE")!,
        entities: [__dirname + '/../../**/*.model{.ts,.js}'],
        ssl,
        logging: false
    };
}

