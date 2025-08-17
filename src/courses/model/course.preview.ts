import { IsInt, IsNumber, IsString } from "class-validator";

export class CoursePreview {
    @IsString()
    path: string;
    @IsNumber()
    length: number;
    @IsInt()
    estimatedTime: number;
}