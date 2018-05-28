
export type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];

export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

// type Required<T> =
//     T extends object
//         ? { [P in Purify<keyof T>]: NonNullable<T[P]>; }
//         : T;
//
// type DeepRequired<T, U extends object | undefined = undefined> =
//     T extends object
//         ? { [P in Purify<keyof T>]: NonNullable<T[P]> extends NonNullable<U | Function | Class> ? NonNullable<T[P]> : DeepRequired<NonNullable<T[P]>, U>; }
//         : T;