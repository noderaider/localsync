import { Mechanism } from "./Mechanism";

/**
 * The controller returned by the localsync interface.
 *
 * @remarks
 * This object is used for controlling synchronization processes.
 */
export interface Controller {
  /** Start synchronizing between tabs / windows. */
  start: () => void;
  /** Stop synchronizing between tabs / windows. */
  stop: () => void;
  /** Trigger a synchronization between tabs / windows. */
  trigger: () => void;
  /** Getter that detects whether localsync is currently running or not. */
  isRunning: boolean;
  /** Used to detect the mechanism chosen for synchronization (localStorage, cookies fallback, or SSR). */
  mechanism: Mechanism;
  /** Used to detect whether a fallback mechanism was employed (cookies). */
  isFallback: boolean;
  /** Used to detect whether a server environment was detected. */
  isServer: boolean;
  /** Used to track this specific tab / window and ensure subscriptions aren't notified from the same tab publishing. */
  instanceID: string;
}
