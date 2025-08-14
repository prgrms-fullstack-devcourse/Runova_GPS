import { Coordinates } from "./coordinates";
import { Type } from "class-transformer";

export class Segment {
    @Type(() => Coordinates)
    begin: Coordinates;

    @Type(() => Coordinates)
    end: Coordinates;

    length: number;
}