import { ApiProperty } from "@nestjs/swagger";

export class ProgressDTO {
    @ApiProperty({ type: "number", description: "진행도 0~1 사이" })
    rate: number;
    @ApiProperty({ type: "boolean", description: "경로 이탈하지 않았는지 여부" })
    onPath: boolean;
    @ApiProperty({ type: "string", nullable: true, description: "안내 텍스트" })
    instruction: string | null;
}