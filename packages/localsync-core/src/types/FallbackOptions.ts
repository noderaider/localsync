/** Controls fallback options related to cookies and polling. */
export interface FallbackOptions {
  pollFrequency: number;
  path: string;
  secure: boolean;
  httpOnly: boolean;
}
