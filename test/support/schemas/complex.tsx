import { z } from "zod";

export const complex = z.object({
  title: z.enum(["", "Dr.", "Prof."]).optional(),
  name: z.string().min(3).max(30),
  birthday: z.coerce.date().max(new Date()).nullable(),
  age: z.number().min(18).nullable(),
  accept: z.boolean().refine((b) => b === true),
});

export const complexWithEffects = complex.refine((data) => {
  return data.birthday !== null || data.age !== null;
});
