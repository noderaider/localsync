type LogLevel = "info" | "warn" | "error" | "silent";

interface Opts {
    tracing: boolean;
    logger: Console;
    logLevel: LogLevel;
    idLength: number;
    pollFrequency: number;
    path: string;
    secure: boolean;
    httpOnly: boolean;
}

interface LocalsyncNavigator {
    appName: string;
    appVersion?: string;
}

export default function localsync(key: string, action, handler, opts: Partial<Opts>, navigator);