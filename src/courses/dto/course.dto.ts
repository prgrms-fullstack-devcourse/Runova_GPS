import { ApiProperty } from "@nestjs/swagger";

export class CourseDTO {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "number" })
    length: number;

    @ApiProperty({ type: "array", items: { type: "[number, number]" } })
    path: [number, number][];
}