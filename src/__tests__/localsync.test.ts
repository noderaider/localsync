jest.mock("universal-cookie");
import localsync from "..";
const localsyncAny = localsync as any;
const fooBar = { foo: "bar" };

describe("localsync", () => {
  const mechanisms = [ "storagesync", "cookiesync", "serversync", "socketsync", "webrtcsync" ];

  test("should have default function export", () => {
    expect(typeof localsync).toBe("function");
  });
  describe("localsync", () => {
    test("should throw if no args passed", () => expect(() => localsyncAny()).toThrow());
    test("should throw if one arg passed", () => expect(() => localsyncAny("key")).toThrow());
    test("should throw if two args passed", () => expect(() => localsyncAny("key", () => fooBar)).toThrow());
    test("should export an object", () => {
      expect(typeof localsync("namesync", () => fooBar, value => {})).toBe("object");
    });

    describe("adheres to localsync interface", () => {
      let controls = null;
      beforeEach(() => { controls = localsync("namesync", () => fooBar, value => {}); });
      afterEach(() => { controls = null; });

      test("should have start property", () => expect(controls.start).toBeTruthy());
      test("should have start function", () => expect(typeof controls.start).toBe("function"));
      test("should have stop property", () => expect(controls.stop).toBeTruthy());
      test("should have stop function", () => expect(typeof controls.stop).toBe("function"));
      test("should have trigger property", () => expect(controls.trigger).toBeTruthy());
      test("should have trigger function", () => expect(typeof controls.trigger).toBe("function"));
      test("should have mechanism property", () => expect(controls.mechanism).toBeTruthy());
      test("should have mechanism string", () => expect(typeof controls.mechanism).toBe("string"));
      test("should have valid mechanism", () => expect(controls.mechanism).toBeTruthy());
      test("should have isRunning property", () => expect(controls.isRunning).toBeDefined());
      test("should have isRunning boolean", () => expect(typeof controls.isRunning).toBe("boolean"));
      test("should have isFallback property", () => expect(controls.isFallback).toBeDefined());
      test("should have isFallback boolean", () => expect(typeof controls.isFallback).toBe("boolean"));
      test("should have isServer property", () => expect(controls.isServer).toBeDefined());
      test("should have isServer boolean", () => expect(typeof controls.isServer).toBe("boolean"));
    });

    describe("server environment", function() {
      let controls = null;
      beforeEach(() => { controls = localsync("namesync", () => fooBar, value => {}); });
      afterEach(() => { controls = null; });
      test("mechanism should be serversync", () => {
        expect(controls.mechanism).toBeTruthy();
        expect(controls.mechanism).toBe("serversync");
      });
      test("isServer should be true", () => expect(controls.isServer).toBe(true));
      test("isFallback should be false", () => expect(controls.isFallback).toBe(false));
    });

    describe("modern browser environment", function() {
      const navigatorsIE =  [ { appName: "Netscape", appVersion: "5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36" }
                            ];
      for (let nav of navigatorsIE) {
        describe(`navigator ${JSON.stringify(nav)}`, () => {
          let controls = null;
          beforeEach(() => {
            controls = localsync("namesync", () => fooBar, value => {}, null, nav);
          });
          afterEach(() => {
            controls = null;
          });
          test("mechanism should be storagesync", () => {
            expect(controls.mechanism).toBeTruthy();
            expect(controls.mechanism).toBe("storagesync");
          });
          test("isServer should be false", () => expect(controls.isServer).toBe(false));
          test("isFallback should be false", () => expect(controls.isFallback).toBe(false));
        });
      }
    });

    describe("legacy browser environment", function() {
      const navigatorsIE =  [ { appName: "Microsoft Internet Explorer" }
                            , { appName: "Netscape", appVersion: "Trident/7.0" }
                            , { appName: "Netscape", appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240" }
                            ];
      for (let nav of navigatorsIE) {
        describe(`navigator ${JSON.stringify(nav)}`, () => {
          let controls = null;
          beforeEach(() => {
            controls = localsync("namesync", () => fooBar, value => {}, null, nav);
          });
          afterEach(() => {
            controls = null;
          });
          test("mechanism should be cookiesync", () => {
            expect(controls.mechanism).toBeTruthy();
            expect(controls.mechanism).toBe("cookiesync");
          });
          test("isServer should be false", () => expect(controls.isServer).toBe(false));
          test("isFallback should be true", () => expect(controls.isFallback).toBe(true));
        });
      }
    });
  });
});
