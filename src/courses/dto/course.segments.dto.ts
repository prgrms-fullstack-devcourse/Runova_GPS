import { Segment } from "../../common/geo";
import { Type } from "class-transformer";

export class CourseSegmentsDTO {
    @Type(() => Segment)
    segments: Segment[];
}