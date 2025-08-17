import { IsNumber } from "class-validator";

export class GetProgressQueryResult {
    @IsNumber()
    progress: number;
    @IsNumber()
    epsilon: number;
    @IsNumber()
    theta: number;

}