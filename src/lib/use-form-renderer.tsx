import { z } from "zod";
import { RendererMap } from "./form-renderer";
import { mapToRenderer } from "./renderer-mapper";
import { isZodEffects } from "./typeguards";

// TODO: Reduce the amount of type parameters overhead.
export type TRenderer<
  TValue,
  TEnumProps,
  TStringProps,
  TNumberProps,
  TBooleanProps
> = TValue extends z.ZodOptional<z.ZodTypeAny> | z.ZodNullable<z.ZodTypeAny>
  ? TRenderer<
      TValue["_def"]["innerType"],
      TEnumProps,
      TStringProps,
      TNumberProps,
      TBooleanProps
    >
  : TValue extends z.ZodEffects<z.ZodTypeAny>
  ? TRenderer<
      TValue["_def"]["schema"],
      TEnumProps,
      TStringProps,
      TNumberProps,
      TBooleanProps
    >
  : TValue extends z.ZodEnum<[string, ...string[]]>
  ? ReturnType<
      RendererMap<TEnumProps, TStringProps, TNumberProps, TBooleanProps>["Enum"]
    >
  : TValue extends z.ZodType<string>
  ? ReturnType<
      RendererMap<
        TEnumProps,
        TStringProps,
        TNumberProps,
        TBooleanProps
      >["String"]
    >
  : TValue extends z.ZodType<number>
  ? ReturnType<
      RendererMap<
        TEnumProps,
        TStringProps,
        TNumberProps,
        TBooleanProps
      >["Number"]
    >
  : TValue extends z.ZodType<boolean>
  ? ReturnType<
      RendererMap<
        TEnumProps,
        TStringProps,
        TNumberProps,
        TBooleanProps
      >["Boolean"]
    >
  : ReturnType<
      RendererMap<
        TEnumProps,
        TStringProps,
        TNumberProps,
        TBooleanProps
      >["Default"]
    >;

export const useFormRenderer = <
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string,
  TEnumProps,
  TStringProps,
  TNumberProps,
  TBooleanProps
>(
  schema: z.ZodObject<TShape> | z.ZodEffects<z.ZodObject<TShape>>,
  renderers: RendererMap<TEnumProps, TStringProps, TNumberProps, TBooleanProps>
) => {
  const shape = isZodEffects(schema) ? schema._def.schema.shape : schema.shape;

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const controls = Object.entries(shape).reduce((ctrls, [key, value]) => {
    return { ...ctrls, [capitalize(key)]: mapToRenderer(value, renderers) };
  }, {} as { [K in Capitalize<TKey>]: TRenderer<TShape[Uncapitalize<K>], TEnumProps, TStringProps, TNumberProps, TBooleanProps> });

  return controls;
};
