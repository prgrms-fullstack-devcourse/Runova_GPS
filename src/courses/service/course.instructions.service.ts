import { Inject, Injectable } from "@nestjs/common";
import Redis from "iovalkey";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { CourseInstruction } from "../model";
import { Repository } from "typeorm";
import { CourseNodesService } from "./course.nodes.service";
import { Transactional } from "typeorm-transactional";
import { makeInstructions } from "./course.instructions.service.internal";

@Injectable()
export class CourseInstructionsService {
    private readonly _threshold: number;

    constructor(
        @InjectRepository(CourseInstruction)
        private readonly _instructionsRepo: Repository<CourseInstruction>,
        @Inject(CourseNodesService)
        private readonly _nodesService: CourseNodesService,
        @Inject(ConfigService)
        config: ConfigService,
    ) {
        this._threshold = config.get<number>(
            "GIS_STRAIGHT_THRESHOLD_DEGREE"
        ) ?? 30;
    }

    @Transactional()
    async createCourseInstructions(courseId: number): Promise<void> {
        const { nodes } = await this._nodesService.getCourseNodes(courseId);

        const vals = makeInstructions(nodes, this._threshold)
            .map(inst => Object.assign(inst, { courseId }));

        await this._instructionsRepo
            .createQueryBuilder()
            .insert()
            .into(CourseInstruction)
            .values(vals)
            .updateEntity(false)
            .orIgnore()
            .execute();
    }

}



