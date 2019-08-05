/**
 * A function with tuple args `TArgs` and result `TResult`.
 */
export type Func<TArgs extends any[], TResult> = (...args: TArgs) => TResult;
