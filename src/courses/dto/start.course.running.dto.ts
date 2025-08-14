import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Coordinates } from "../../common/geo";
import { IsInt, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@ApiExtraModels(Coordinates)
export class StartCourseRunningDTO {
    @IsInt()
    @ApiProperty({ type: "integer", description: "달릴 경로 아이디" })
    courseId: number;

    @ValidateNested()
    @Type(() => Coordinates)
    @ApiProperty({ type: Coordinates, required: true, description: "시작 위치" })
    origin: Coordinates;
}