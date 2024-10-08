import { z } from "zod";

export function isZodEffects<T extends z.ZodTypeAny>(
  value: z.ZodTypeAny
): value is z.ZodEffects<T> {
  return (
    value &&
    (value._def.typeName === "ZodEffects" ||
      isZodEffects(value._def.innerType) ||
      isZodEffects(value._def.schema))
  );
}

export function isString(value: z.ZodTypeAny): value is z.ZodString {
  return (
    value &&
    (value._def.typeName === z.string()._def.typeName ||
      isString(value._def.innerType) ||
      isString(value._def.schema))
  );
}

export function isNumber(value: z.ZodTypeAny): value is z.ZodNumber {
  return (
    value &&
    (value._def.typeName === z.number()._def.typeName ||
      isNumber(value._def.innerType) ||
      isNumber(value._def.schema))
  );
}

export function isBoolean(value: z.ZodTypeAny): value is z.ZodBoolean {
  return (
    value &&
    (value._def.typeName === z.boolean()._def.typeName ||
      isBoolean(value._def.innerType) ||
      isBoolean(value._def.schema))
  );
}

export function isEnum<T extends [string, ...string[]]>(
  value: z.ZodTypeAny
): value is z.ZodEnum<T> {
  return (
    value &&
    (value._def.typeName === z.enum([""])._def.typeName ||
      isEnum(value._def.innerType) ||
      isEnum(value._def.schema))
  );
}

export function isDate(value: z.ZodTypeAny): value is z.ZodDate {
  return (
    value &&
    (value._def.typeName === z.date()._def.typeName ||
      isDate(value._def.innerType) ||
      isDate(value._def.schema))
  );
}
