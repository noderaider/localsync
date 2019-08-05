import { Func } from "./Func";

/**
 * A function with tuple args `TArgs` and `void` result.
 */
export type Action<TArgs extends any[]> = Func<TArgs, void>;
