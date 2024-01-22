import { z } from "zod";
import { mapToRenderer } from "./renderer-mapper";
import { CheckboxRenderer } from "./renderers/checkbox-renderer";
import { InputRenderer } from "./renderers/input-renderer";
import { NullRenderer } from "./renderers/null-renderer";
import { SelectRenderer } from "./renderers/select-renderer";
import { isZodEffects } from "./typeguards";

export type TRenderer<TValue> = TValue extends
  | z.ZodOptional<z.ZodTypeAny>
  | z.ZodNullable<z.ZodTypeAny>
  ? TRenderer<TValue["_def"]["innerType"]>
  : TValue extends z.ZodEffects<z.ZodTypeAny>
  ? TRenderer<TValue["_def"]["schema"]>
  : TValue extends z.ZodEnum<infer TEnum extends [string, ...string[]]>
  ? ReturnType<typeof SelectRenderer<TEnum[number]>>
  : TValue extends z.ZodType<string>
  ? ReturnType<typeof InputRenderer>
  : TValue extends z.ZodType<number>
  ? ReturnType<typeof InputRenderer>
  : TValue extends z.ZodType<boolean>
  ? ReturnType<typeof CheckboxRenderer>
  : ReturnType<typeof NullRenderer>;

export const useFormRenderer = <
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string
>(
  schema: z.ZodObject<TShape> | z.ZodEffects<z.ZodObject<TShape>>
) => {
  const shape = isZodEffects(schema) ? schema._def.schema.shape : schema.shape;

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const controls = Object.entries(shape).reduce((ctrls, [key, value]) => {
    return { ...ctrls, [capitalize(key)]: mapToRenderer(value) };
  }, {} as { [K in Capitalize<TKey>]: TRenderer<TShape[Uncapitalize<K>]> });

  return controls;
};
