import { Segment } from "../dto";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { GetSegmentsQueryHandler, GetSegmentsQueryResult } from "../query";

@Injectable()
export class GetSegmentsService {

    constructor(
       @Inject(GetSegmentsQueryHandler)
       private readonly _queryHandler: GetSegmentsQueryHandler,
    ) {}

    async getSegments(courseId: number): Promise<Segment[]> {
        const { pos, len, deg  } = await this.getResultOrReject(courseId);

        if (!(pos.length === len.length && pos.length && deg.length))
            throw Error("pos, len, deg should have same length");

        return Array.from({ length: pos.length })
            .map((_, idx): Segment => ({
                pos: pos[idx],
                len: len[idx],
                deg: deg[idx],
            }));
    }

    private async getResultOrReject(courseId: number): Promise<GetSegmentsQueryResult> {
        const result = await this._queryHandler.execute(courseId);
        if (!result) throw new NotFoundException();
        return result;
    }
}