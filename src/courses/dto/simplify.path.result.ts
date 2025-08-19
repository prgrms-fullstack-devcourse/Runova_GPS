import { IsNumber, IsString } from "class-validator";

export class SimplifyPathResult {
    @IsString()
    path: string;

    @IsNumber()
    length: number;
}