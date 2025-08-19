import { makeInstructions } from "./course.instructions.service.internal";
import { CourseNode, CourseInstructionDTO } from "../dto";

describe("makeInstructions", () => {
    const threshold = 10;

    it("should return empty text when delta bearing is within threshold", () => {
        const nodes: CourseNode[] = [
            { geo: "POINT(0 0)", bearing: 0 },
            { geo: "POINT(1 1)", bearing: 5 }, // within threshold
        ];
        const result = makeInstructions(nodes, threshold);
        expect(result).toEqual<CourseInstructionDTO[]>([
            { geo: "POINT(0 0)", text: "" },
            { geo: "POINT(1 1)", text: "" },
        ]);
    });

    it("should return left turn instruction when bearing increases above threshold", () => {
        const nodes: CourseNode[] = [
            { geo: "POINT(0 0)", bearing: 0 },
            { geo: "POINT(1 1)", bearing: 45 },
        ];
        const result = makeInstructions(nodes, threshold);
        expect(result[1].text).toContain("왼쪽");
        expect(result[1].text).toContain("회전");
    });

    it("should return right turn instruction when bearing decreases below threshold", () => {
        const nodes: CourseNode[] = [
            { geo: "POINT(0 0)", bearing: 90 },
            { geo: "POINT(1 1)", bearing: 45 },
        ];
        const result = makeInstructions(nodes, threshold);
        expect(result[1].text).toContain("오른쪽");
        expect(result[1].text).toContain("회전");
    });

    it("should return U-turn instruction when bearing difference is large", () => {
        const nodes: CourseNode[] = [
            { geo: "POINT(0 0)", bearing: 0 },
            { geo: "POINT(1 1)", bearing: 200 },
        ];
        const result = makeInstructions(nodes, threshold);
        expect(result[1].text).toContain("유턴");
    });

    it("should preserve geo values in output", () => {
        const nodes: CourseNode[] = [
            { geo: "POINT(10 10)", bearing: 0 },
            { geo: "POINT(20 20)", bearing: 90 },
        ];
        const result = makeInstructions(nodes, threshold);
        expect(result[0].geo).toBe("POINT(10 10)");
        expect(result[1].geo).toBe("POINT(20 20)");
    });
});