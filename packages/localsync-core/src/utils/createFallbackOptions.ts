import { FallbackOptions } from "../types";

/** Ensures all fallback options are defaulted. */
export const createFallbackOptions = (
  fallback: Partial<FallbackOptions> = {}
): FallbackOptions => {
  return {
    pollFrequency: 3000,
    path: "/",
    secure: false,
    httpOnly: false,
    ...fallback
  };
};
