import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Coordinates } from "../../common/geo";
import { GetCoursePreviewQueryHandler } from "../query";

@Injectable()
export class SimplifyPathService {
    private readonly _tolM: number;

    constructor(
       @Inject(GetCoursePreviewQueryHandler)
       private readonly _queryHandler: GetCoursePreviewQueryHandler,
       @Inject(ConfigService)
       config: ConfigService,
    ) {
        this._tolM = config.get<number>(
            "GIS_SIMPLIFY_TOL"
        ) ?? 0.000008;
    }

    async simplify(path: Coordinates[]): Promise<Coordinates[]> {
        const result = await this._queryHandler.execute(path, this._tolM);
        return result.path;
    }
}