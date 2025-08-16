
export type ArrayMappedType<T extends object> = {
    [P in keyof T]: T[P][];
}