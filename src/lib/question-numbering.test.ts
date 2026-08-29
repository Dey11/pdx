import { describe, expect, test } from "bun:test";

import { parseNextQuestionNumber } from "../../worker/src/question-numbering";

describe("question-bank numbering checkpoint", () => {
  test("returns the next monotonic question number", () => {
    expect(parseNextQuestionNumber("12", 8)).toBe(13);
  });

  test.each(["", "0", "2garbage", "2.5", "-2"])(
    "rejects invalid marker %s",
    (marker) => {
      expect(() => parseNextQuestionNumber(marker, 1)).toThrow(
        "invalid question numbering"
      );
    }
  );

  test("rejects a marker that moves numbering backward", () => {
    expect(() => parseNextQuestionNumber("7", 8)).toThrow(
      "invalid question numbering"
    );
  });
});
