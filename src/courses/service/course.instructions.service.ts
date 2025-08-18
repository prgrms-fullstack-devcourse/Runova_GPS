import { Inject, Injectable } from "@nestjs/common";
import Redis from "iovalkey";

@Injectable()
export class CourseInstructionsService {

    constructor(
        @Inject(Redis)
        private readonly _redis: Redis,
    ) {
    }

}