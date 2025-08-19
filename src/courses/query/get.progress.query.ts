import { Query } from "@nestjs/cqrs";
import { GetProgressQueryResult } from "./get.progress.query.result";
import { Coordinates } from "../../common/geo";

export class GetProgressQuery extends Query<GetProgressQueryResult> {
    constructor(
        public readonly courseId: number,
        public readonly location: Coordinates,
    ) { super(); }
}