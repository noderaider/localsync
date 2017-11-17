export as namespace Localsync;

export type LogLevel = "info" | "warn" | "error" | "silent";

export interface Opts {
    tracing: boolean;
    logger: Console;
    logLevel: LogLevel;
    idLength: number;
    pollFrequency: number;
    path: string;
    secure: boolean;
    httpOnly: boolean;
}

export interface LocalsyncNavigator {
    appName: string;
    appVersion?: string;
}

export default function localsync(key: string, action, handler, opts?: Partial<Opts>, navigator?);