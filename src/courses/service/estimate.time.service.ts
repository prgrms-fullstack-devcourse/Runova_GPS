import { Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DateTimeFormatter, nativeJs } from "@js-joda/core";

export class EstimateTimeService {
    private readonly _meanSpeed: number;

    private readonly _formatter: DateTimeFormatter
        = DateTimeFormatter.ofPattern("HH:mm:ss");

    constructor(
        @Inject(ConfigService)
        config: ConfigService,
    ) {
        this._meanSpeed = config.get<number>(
            "RUNNER_MEAN_SPEED"
        ) ?? 8;
    }

    estimateTime(length: number): string {
        const ms = (length / this._meanSpeed) * 3.6 * Math.pow(10, 6);
        const t = nativeJs(new Date(ms)).toLocalTime();
        return t.format(this._formatter);
    }
}