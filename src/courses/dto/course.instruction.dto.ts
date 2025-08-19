import { IsString } from "class-validator";

export class CourseInstructionDTO {
    @IsString()
    geo: string;
    @IsString()
    text: string;
}