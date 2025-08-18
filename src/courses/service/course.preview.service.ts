import { Inject, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Coordinates, toLineString } from "../../common/geo";
import { plainToInstanceOrReject } from "../../utils";
import { Transactional } from "typeorm-transactional";
import { ConfigService } from "@nestjs/config";
import { CoursePreview } from "../dto";

@Injectable()
export class CoursePreviewService {
    private readonly _tol: number;
    private readonly _pace: number;

    constructor(
       @InjectDataSource()
       private readonly _ds: DataSource,
       @Inject(ConfigService)
       config: ConfigService,
    ) {
        this._tol = config.get<number>(
            "GIS_SIMPLIFY_TOL"
        ) ?? 0.000008;

        this._pace = config.get<number>(
            "RUNNER_MEAN_PACE"
        ) ?? 1.7;
    }

    @Transactional()
    async makePreview(path: Coordinates[]): Promise<CoursePreview> {

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
                tolerance: this._tol,
                pace: this._pace,
            })
            .getRawOne();

        return plainToInstanceOrReject(CoursePreview, raw);
    }


}




