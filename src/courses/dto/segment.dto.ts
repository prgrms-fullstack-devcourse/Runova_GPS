import { IsNumber } from "class-validator";
import { ArraySize } from "../../utils/decorator";

export class SegmentDTO {
    @ArraySize(2)
    @IsNumber({}, { each: true })
    begin: [number, number];

    @ArraySize(2)
    @IsNumber({}, { each: true })
    end: [number, number];

    @IsNumber()
    length: number;
}