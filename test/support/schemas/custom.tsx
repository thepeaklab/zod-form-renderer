import { z } from "zod";

export const nonPrimitive = z.object({
  profileImage: z.custom<File>().refine((file) => file.type.endsWith("png")),
});
