import { Type } from "class-transformer";
import { CourseNode } from "./course.node";
import { ValidateNested } from "class-validator";

export class GetCourseNodesResult {
    @ValidateNested({ each: true })
    @Type(() => CourseNode)
    nodes: CourseNode[];
}