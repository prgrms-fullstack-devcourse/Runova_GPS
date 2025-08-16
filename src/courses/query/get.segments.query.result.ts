import { IsNumber, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Coordinates } from "../../common/geo";

export class GetSegmentsQueryResult {
    @ValidateNested({ each: true })
    @Type(() => Coordinates)
    pos: Coordinates[];

    @IsNumber({}, { each: true })
    len: number[];

    @IsNumber({}, { each: true })
    deg: number[];
}