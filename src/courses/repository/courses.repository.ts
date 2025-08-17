import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryBuilder, Repository, SelectQueryBuilder } from "typeorm";
import { Coordinates, toLineString } from "../../common/geo";
import { Course } from "../model";
import { ConfigService } from "@nestjs/config";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CoursesRepository {
    private readonly _tolM: number;

    constructor(
      @InjectRepository(Course)
      private readonly _repo: Repository<Course>,
      @Inject(ConfigService)
      config: ConfigService,
    ) {
        this._tolM = config.get<number>(
            "GIS_SIMPLIFY_TOL"
        ) ?? 0.000008;
    }

    @Transactional()
    async save(
        userId: number,
        path: Coordinates[],
        tol: number,
        pace: number,
    ) {

        const { generatedMaps } = await this._repo
            .createQueryBuilder("course")
            .insert()
            .into(Course)
            .values({
                userId,
                path: () => `
                ST_Simplified(ST_GeomFromGeoJSON(:path), :tol)
                `
            })
            .setParameters({
                userId,
                path: toLineString(path),
                tol
            })
            .returning("*")
            .updateEntity(false)
            .execute();

        if (!generatedMaps.length) throw Error("Query Failed");
        const id: number = generatedMaps[0].id;

        await this._repo
            .createQueryBuilder("course")
            .update()
            .set({

            })
    }
}