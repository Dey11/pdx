import { describe, expect, test } from "bun:test";

import {
  mergedMaterialKey,
  questionBankPartKey,
  theoryPartKey,
} from "../../worker/src/storage-keys";

describe("generation storage keys", () => {
  test("are deterministic across job retries", () => {
    expect(theoryPartKey("material-1", "task-1")).toBe(
      theoryPartKey("material-1", "task-1")
    );
    expect(questionBankPartKey("material-1", "task-1")).toBe(
      questionBankPartKey("material-1", "task-1")
    );
    expect(mergedMaterialKey("theory", "material-1")).toBe(
      mergedMaterialKey("theory", "material-1")
    );
  });
});
