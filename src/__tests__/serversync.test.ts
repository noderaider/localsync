import serversync from "../serversync";

describe("serversync", () => {
  test("should have default function export", () => {
    expect(typeof serversync).toBe("function");
  });
});
