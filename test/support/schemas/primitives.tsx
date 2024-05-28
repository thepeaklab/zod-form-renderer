import { z } from "zod";

export const primitives = z.object({
  title: z.enum(["", "Dr.", "Prof."]),
  name: z.string(),
  birthday: z.coerce.date(),
  age: z.number(),
  accept: z.boolean(),
});
