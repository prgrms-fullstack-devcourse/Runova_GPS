import { IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { Coordinates } from "../../common/geo";

export class InterpolateLocationQueryResult {
    // 진행률, 0 ~ 1 사이의 실수
    @IsNumber()
    frac: number;

    // 보간점 (현재 위치와 가장 가까운 경로 위의 점)
    @Type(() => Coordinates)
    interpolated: Coordinates;

    // 거리 오차 <=> 실제 위치와 보간점 사이의 거리
    @IsNumber()
    epsilon: number;

    // 각도 오차 <=> 현재 위치와 보간점 사이의 방위각(azimuth angle)
    @IsNumber()
    theta: number;
}