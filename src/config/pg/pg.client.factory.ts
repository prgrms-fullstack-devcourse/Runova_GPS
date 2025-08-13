import { ConfigService } from "@nestjs/config";
import { Client } from "pg";
import fs from "node:fs";

export function pgClientFactory(config: ConfigService): Client {
    // postgresql rds는 ssl 인증서를 요구하므로, 프로덕션에서는 필요함
    const ca = config.get<string>("DB_SSL_CA");

    const ssl = ca ? {
        ca: fs.readFileSync(ca).toString(),
        rejectUnauthorized: true,
    } : false;

    return new Client({
        ssl,
        host: config.get<string>("DB_HOST")!,
        port: config.get<number>("DB_PORT")!,
        user: config.get<string>("DB_USERNAME")!,
        password: config.get<string>("DB_PASSWORD")!,
        database: config.get<string>("DB_DATABASE")!,
    });
}