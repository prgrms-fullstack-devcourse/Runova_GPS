import { IsNumber, IsString } from "class-validator";

export class CourseNode {
    @IsString()
    geo: string;
    @IsNumber()
    bearing: number;
}