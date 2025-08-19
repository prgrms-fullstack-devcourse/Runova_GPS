import { CourseInstructionDTO, CourseNode } from "../dto";

export function makeInstructions(
    nodes: CourseNode[],
    threshold: number,
): CourseInstructionDTO[] {
    let prevBearing = 0;

    return nodes.map(({ geo, bearing }) => {
        const delta = __deltaBearing(prevBearing, bearing, threshold);
        const text = __makeInstructionText(delta);
        prevBearing = bearing;
        return { geo, text };
    });
}

function __deltaBearing(b1: number, b2: number, threshold: number): number {
    const b = (b2 - b1  + 540) % 360 - 180;
    return Math.abs(b) < threshold ? 0 : b;
}

function __makeInstructionText(deltaBearing: number): string {
    if (!deltaBearing) return "";
    const direction = deltaBearing > 0 ? "왼쪽" : "오른쪽"
    const scale = Math.abs(deltaBearing) < 150 ? "회전" : "유턴";
    return `잠시후 ${direction}으로 ${scale} 있습니다. 앱을 확인해 주세요`;
}