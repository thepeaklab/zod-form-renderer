import { z } from "zod";

export const defineField =
  <T extends z.ZodTypeAny>(
    /** Decide if this renderer matches. */
    predicate: (value: T) => boolean,

    /** The actual renderer to execute. */
    renderer: (value: T) => JSX.Element
  ) =>
  (value: T) => {
    if (predicate(value)) {
      return renderer(value);
    }

    return null;
  };

// const textField = defineField(
//   (value) => value._def.typeName === z.string()._def.typeName
// );
