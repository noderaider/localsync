// tslint:disable:naming-convention
const _global: any = global;

// Mocked `sdk` API calls still use an antiforgery token.
// This inserts a token in the global context to be used by the mocked
// `sdk` fetching calls.
_global.__JEST__ = true;
_global.document.execCommand = jest.fn();

_global.Headers = jest.fn();
_global.scrollTo = jest.fn();

/**
 * This removes unhandledRejection error noise in Node.
 * If enabled, all unhandledRejection's will be swallowed.
 * If disabled, unhandledRejection errors will have a cleaner stack trace.
 */
const SQUELCH_UNHANDLED_REJECTION = true;

if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
  process.on("unhandledRejection", reason => {
    if (!SQUELCH_UNHANDLED_REJECTION) {
      throw reason;
    }
  });

  // Avoid memory leak by adding too many listeners
  (process.env as Record<
    string,
    string | boolean
  >).LISTENING_TO_UNHANDLED_REJECTION = true;
}
