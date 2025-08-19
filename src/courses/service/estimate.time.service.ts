import { Inject, Injectable } from "@nestjs/common";
import { DateTimeFormatter, nativeJs } from "@js-joda/core";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class EstimateTimeService {
    private readonly _pace: number;

    private readonly _formatter: DateTimeFormatter
        = DateTimeFormatter.ofPattern("HH:mm:ss");

    constructor(
        @Inject(ConfigService)
        config: ConfigService,
    ) {
        this._pace = config.get<number>(
            "RUNNER_MEAN_PACE"
        ) ?? 1.7;
    }

    estimateTime(length: number): string {
        const ms = Math.round((length / this._pace) * 1000);
        return nativeJs(new Date(ms)).format(this._formatter);
    }
}