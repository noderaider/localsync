import serversync from "serversync";
import cookiesync from "cookiesync";
import storagesync from "storagesync";

let navigator = typeof window === "object" ? window.navigator : (() => {})();

const isEdgeOrIE = () => {
  if (!navigator) return false;
  return (
    navigator.appName === "Microsoft Internet Explorer" ||
    (navigator.appName === "Netscape" &&
      /(Trident|Edge)/i.test(navigator.appVersion))
  );
};
type Func<T extends any[], TResult> = (...args: T) => TResult;

export default function localsync<T extends any[], TResult>(
  key: string,
  action: Func<T, TResult>,
  handler: Func<[TResult], void>
) {
  if (typeof navigator === "undefined") return serversync(key, action, handler);
  return (isEdgeOrIE() ? cookiesync : storagesync)(key, action, handler);
}
