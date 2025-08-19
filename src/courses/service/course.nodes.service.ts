import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "../model";
import { Repository } from "typeorm";
import { GetCourseNodesResult } from "../dto";
import { plainToInstanceOrReject } from "../../utils";

@Injectable()
export class CourseNodesService {

    constructor(
        @InjectRepository(Course)
        private readonly _coursesRepo: Repository<Course>
    ) {}

    async getCourseNodes(courseId: number): Promise<GetCourseNodesResult> {

        const raw = await this._coursesRepo
            .createQueryBuilder("course")
            .select(
                `
                jsonb_agg(
                    jsonb_build_object(
                        'geo', n.geo,
                        'bearing', n.bearing
                    )
                )
                `,
                "nodes"
            )
            .innerJoin(
                `
                LATERAL(
                    SELECT
                        ST_GeoHash(geom) AS geo,
                        ST_Azimuth(
                            ST_StartPoint(geom),
                            ST_EndPoint(geom)
                        ) AS bearing
                    FROM ST_DumpSegments(course.path)
                )
                `,
                "n"
            )
            .where("course.id = :id", { id: courseId })
            .getRawOne();

        return plainToInstanceOrReject(GetCourseNodesResult, raw);
    }
}