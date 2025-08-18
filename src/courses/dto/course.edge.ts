import { IsNumber, IsString } from "class-validator";

export class CourseEdge {
    @IsString()
    geo: string;
    @IsNumber()
    length: number;
    @IsNumber()
    bearing: number;
}