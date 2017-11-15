import cookiesync from "../cookiesync";

describe("cookiesync", () => {
  test("should have default function export", () => {
    expect(typeof cookiesync).toBe("function");
  });
});
