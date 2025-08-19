import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Coordinates } from "../../common/geo";
import { Type } from "class-transformer";

@ApiExtraModels(Coordinates)
export class CourseDTO {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "number", description: "총 거리(km)" })
    length: number;

    @ApiProperty({ type: "string", pattern: "hh:mm:ss", description: "예상 소요 시간" })
    timeRequired: string;
    
    @Type(() => Coordinates)
    @ApiProperty({ type: Coordinates })
    path: Coordinates[];
}