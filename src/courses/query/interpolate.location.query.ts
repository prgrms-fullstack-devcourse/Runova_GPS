import { Query } from "@nestjs/cqrs";
import { InterpolateLocationQueryResult } from "./interpolate.location.query.result";
import { Coordinates } from "../../common/geo";

export class InterpolateLocationQuery extends Query<InterpolateLocationQueryResult> {
    constructor(
        public readonly courseId: number,
        public readonly location: Coordinates,
    ) { super(); }
}