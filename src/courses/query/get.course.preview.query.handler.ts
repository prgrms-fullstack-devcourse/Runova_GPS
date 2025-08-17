import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Coordinates, toLineString } from "../../common/geo";
import { GetCoursePreviewQueryResult } from "./get.course.preview.query.result";
import { plainToInstanceOrReject } from "../../utils";


@Injectable()
export class GetCoursePreviewQueryHandler {

    constructor(
       @InjectDataSource()
       private readonly _ds: DataSource,
    ) {}

    async execute(
        path: Coordinates[],
        tolerance: number,
        pace: number,
    ): Promise<GetCoursePreviewQueryResult> {

        const raw = await this._ds
            .createQueryBuilder()
            .addCommonTableExpression(
                `
                SELECT ST_Simplify(
                ST_SetSRID(ST_GeomFromGeoJSON(:json), 4326), 
                :tolerance
                )
                AS geom
                `,
                "simplified"
            )
            .addCommonTableExpression(
                `
                SELECT ST_Length(ST_Transform(s.geom, 5179))
                AS len
                `,
                "length",
            )
            .select(`ST_AsGeoJSON(s.geom)`, "path")
            .addSelect(`l.len`, "length")
            .addSelect(`floor((l.len / :pace) * 1000)`, "time")
            .from("simplified", "s")
            .addFrom("length", "l")
            .setParameters({
                json: toLineString(path),
                tolerance,
                pace,
            })
            .getRawOne();

        return plainToInstanceOrReject(
            GetCoursePreviewQueryResult,
            raw
        );
    }


}




