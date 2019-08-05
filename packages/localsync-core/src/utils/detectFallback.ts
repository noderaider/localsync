let navigator = typeof window === "object" ? window.navigator : (() => {})();

/**
 * Detects whether localsync should use fallback synchronization for legacy browsers.
 *
 * @remarks
 * Server environment is not considered fallback.
 * Edge / IE require legacy mechanism.
 */
export const detectFallback = () => {
  if (!navigator) return false;
  const isEdgeOrIE =
    navigator.appName === "Microsoft Internet Explorer" ||
    (navigator.appName === "Netscape" &&
      /(Trident|Edge)/i.test(navigator.appVersion));
  return isEdgeOrIE;
};
