import { Segment } from "./segment";
import { Type } from "class-transformer";

export class GetSegmentsResult {
    @Type(() => Segment)
    segments: Segment[];
}