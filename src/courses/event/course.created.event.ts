import { Coordinates } from "../../common/geo";
import { IEvent } from "@nestjs/cqrs";

export class CourseCreatedEvent implements IEvent {
    constructor(
       public readonly courseId: number,
       public readonly path: Coordinates[],
    ) {}
}