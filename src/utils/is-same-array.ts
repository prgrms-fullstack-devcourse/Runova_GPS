export function isSameArray<T>(u: T[], v: T[]): boolean {
    if (u.length !== v.length) return false;
    return u.every((x, idx) => x === v[idx]);
}