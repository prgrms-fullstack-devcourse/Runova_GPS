import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RotationInfo } from "../dto";

@Injectable()
export class NavigationTextService {
    private readonly _threshold: number;

    constructor(
        @Inject(ConfigService)
        config: ConfigService,
    ) {
        this._threshold = config.get<number>(
            "GIS_STRAIGHT_THRESHOLD_DEGREE"
        ) ?? 30;
    }

   makeWarning(epsilon: number, theta: number): string {
        const { direction, scale } = __makeRotationInfo(theta);

        return `
        경로에서 벗어났습니다. ${direction}으로 ${scale} 후
        ${epsilon}m 이동해주세요!
        `;
   }

   makeInstruction(bearing1: number, bearing2: number): string {
        const delta = (bearing2 - bearing1  + 540) % 360 - 180;
        if (Math.abs(delta) < this._threshold) return "";
        const { direction, scale } = __makeRotationInfo(delta);
        return `잠시후 ${direction}으로 ${scale} 있습니다. 앱을 확인해 주세요`;
   }
}

function __makeRotationInfo(deg: number): RotationInfo {
    return {
        direction: deg > 0 ? "왼쪽" : "오른쪽",
        scale: Math.abs(deg) > 150 ? "유턴" : "회전"
    };
}