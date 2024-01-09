import { expect, test } from "vitest";
import { transform } from "../src/form-renderer";

test("returns object with name", () => {
  expect(transform().name).toBe("Zod");
});
