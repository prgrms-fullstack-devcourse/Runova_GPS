import { Coordinates } from "../../common/geo";
import { ApiProperty } from "@nestjs/swagger";

export class NavigationInstruction {
    @ApiProperty({ type: Coordinates, description: "방향이 바뀌는 지점 좌표" })
    corner: Coordinates;

    @ApiProperty({ type: "string", description: "길안내 텍스트" })
    text: string;
}