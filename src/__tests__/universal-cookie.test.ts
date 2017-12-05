import * as Cookies from "universal-cookie";

describe("universal-cookie", () => {
    test("has a default function export", () => {
        expect(typeof Cookies).toBe("function");
    });
    test("has a get function", () => {
        expect(typeof new Cookies().get).toBe("function");
    });
    test("has a set function", () => {
        expect(typeof new Cookies().set).toBe("function");
    });
    test("has a remove function", () => {
        expect(typeof new Cookies().remove).toBe("function");
    });
});