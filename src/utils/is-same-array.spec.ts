import { isSameArray } from "./is-same-array";

describe("isSameArray", () => {

    it("returns true for two arrays of same length and elements", () => {
        const u = [1, 2, 3, 4, 5];
        const v = [1, 2, 3, 4, 5];
        expect(isSameArray(u, v)).toBe(true);
    });

    it("returns false", () => {
        const u = [1, 2, 3, 4, 5];
        const v = [5, 6, 7, 8, 9];
        expect(isSameArray(u, v)).toBe(false);
    });

    it("returns false", () => {
        const u = [1, 2, 3, 4, 5];
        const v = [1, 2, 3];
        expect(isSameArray(u, v)).toBe(false);
    });

})