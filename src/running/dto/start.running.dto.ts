import { Coordinates } from "../../common/geo";
import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";

@ApiExtraModels(Coordinates)
export class StartRunningDTO {
    @ApiProperty({ type: "integer", required: false, description: "달릴 경로 아이디" })
    courseId?: number;

    @ApiProperty({ type: Coordinates, required: true, description: "시작 위치" })
    origin: Coordinates;
}