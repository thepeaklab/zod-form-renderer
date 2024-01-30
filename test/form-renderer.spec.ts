import { expect, test } from "vitest";
import { z } from "zod";
import { useFormRenderer } from "../src/lib/use-form-renderer";

test("returns form fields for each schema property", () => {
  const schema = z.object({
    title: z.enum(["Mr", "Mrs", "Miss", "Dr", "Prof"]),
    name: z.string(),
    accept: z.boolean(),
  });

  const fields = useFormRenderer(schema);

  expect(fields.Title).toBeDefined();
  expect(fields.Name).toBeDefined();
  expect(fields.Accept).toBeDefined();
});
