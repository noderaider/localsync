import { localsync } from "../localsync";
import { Controller } from "localsync-core";

describe("lib", () => {
  describe("localsync", () => {
    describe("server environment", function() {
      let controller: Controller | undefined;
      beforeEach(() => {
        controller = localsync({ channel: "test-channel" })(
          () => {
            foo: "bar";
          },
          _value => {}
        );
      });
      afterEach(() => {
        controller = undefined;
      });
      test("default mechanism should be storagesync", () => {
        expect(controller!.mechanism).toBe("storagesync");
      });
      test("isServer should be false by default", () => {
        expect(controller!.isServer).toBe(false);
      });
      test("isFallback should be false", () => {
        expect(controller!.isFallback).toBe(false);
      });
    });

    /*
    // TODO: Figure out alternative to rewire with TypeScript support.
    describe("modern browser environment", function() {
      const navigatorsIE = [
        {
          appName: "Netscape",
          appVersion:
            "5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
        }
      ];
      for (let nav of navigatorsIE) {
        describe(`navigator ${JSON.stringify(nav)}`, () => {
          let undo = null;
          let controls = null;
          beforeEach(() => {
            undo = lib.__set__("navigator", nav);
            controls = localsync(
              "namesync",
              () => {
                foo: "bar";
              },
              value => {}
            );
          });
          afterEach(() => {
            controls = null;
            undo();
          });
          test("mechanism should be storagesync", () => {
            expect(controls.mechanism).toBe("storagesync");
          });
          test("isServer should be false", () => {
            expect(controls.isServer).toBe(false);
          });
          test("isFallback should be false", () => {
            expect(controls.isFallback).toBe(false);
          });
        });
      }
    });

    describe("legacy browser environment", function() {
      const navigatorsIE = [
        { appName: "Microsoft Internet Explorer" },
        { appName: "Netscape", appVersion: "Trident/7.0" },
        {
          appName: "Netscape",
          appVersion:
            "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240"
        }
      ];
      for (let nav of navigatorsIE) {
        describe(`navigator ${JSON.stringify(nav)}`, () => {
          let undo = null;
          let controls = null;
          beforeEach(() => {
            undo = lib.__set__("navigator", nav);
            controls = localsync(
              "namesync",
              () => {
                foo: "bar";
              },
              value => {}
            );
          });
          afterEach(() => {
            controls = null;
            undo();
          });
          test("mechanism should be cookiesync", () => {
            expect(controls.mechanism).toBe("cookiesync");
          });
          test("isServer should be false", () => {
            expect(controls.isServer).toBe(false);
          });
          test("isFallback should be true", () => {
            expect(controls.isFallback).toBe(true);
          });
        });
      }
    });
    */
  });
});
