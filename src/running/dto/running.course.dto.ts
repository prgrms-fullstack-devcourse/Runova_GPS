import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Coordinates } from "../../common/geo";
import { Type } from "class-transformer";

@ApiExtraModels(Coordinates)
export class RunningCourseDTO {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "string" })
    takenTimeExpectation: string;

    @ApiProperty({ type: "number" })
    length: number;
    
    @Type(() => Coordinates)
    @ApiProperty({ type: Coordinates })
    path: Coordinates[];
}