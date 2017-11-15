import storagesync from "../storagesync";

describe("storagesync", () => {
  test("should have default function export", () => {
    expect(typeof storagesync).toBe("function");
  });
});
