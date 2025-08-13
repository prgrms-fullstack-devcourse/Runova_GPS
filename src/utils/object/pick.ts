export function pick<
    T extends object,
    K extends keyof T
>(obj: T, keys: K[]): Pick<T, K> {
    return Object.fromEntries(
        keys.map(k => [k, obj[k]])
    ) as Pick<T, K>;
}