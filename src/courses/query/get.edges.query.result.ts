import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CourseEdge } from "../dto";

export class GetEdgesQueryResult {
    @ValidateNested({ each: true })
    @Type(() => CourseEdge)
    edges: CourseEdge[];
}