import { Type } from "class-transformer";
import { Coordinates } from "../../common/geo";

export class Segment {
    @Type(() => Coordinates)
    pos: Coordinates;
    len: number;
    deg: number;
}