import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Coordinates } from "../../common/geo";
import { CoursePreview } from "../model";

@Injectable()
export class CoursePreviewRepository {

    constructor(
        @InjectDataSource()
        private readonly _ds: DataSource
    ) {}

    async create(
        path: Coordinates[],
        tol: number,
        pace: number,
    ): Promise<CoursePreview> {

        

    }
}