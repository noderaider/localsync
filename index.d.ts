declare namespace Localsync {
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

    interface Navigator {
        appName: string;
        appVersion?: string;
    }
}