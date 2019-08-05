import { createContext } from "../createContext";
import { LogLevel } from "../../types";

describe("createContext", () => {
  test("Should set level default", () => {
    const config = { channel: "test-channel" };
    const context = createContext(config);
    expect(context.options.level).toBe(LogLevel.ERROR);
  });
});
