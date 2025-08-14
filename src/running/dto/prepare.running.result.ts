import { RunningCourseDTO } from "./running.course.dto";
import { Segment } from "../../common/geo";

export class PrepareRunningResult {
    course: RunningCourseDTO;
    segments: Segment[];
}