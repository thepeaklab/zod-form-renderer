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
  TBooleanProps,
  TDateProps,
  TSubmitProps
> = TValue extends z.ZodOptional<z.ZodTypeAny> | z.ZodNullable<z.ZodTypeAny>
  ? TRenderer<
      TValue["_def"]["innerType"],
      TEnumProps,
      TStringProps,
      TNumberProps,
      TBooleanProps,
      TDateProps,
      TSubmitProps
    >
  : TValue extends z.ZodEffects<z.ZodTypeAny>
  ? TRenderer<
      TValue["_def"]["schema"],
      TEnumProps,
      TStringProps,
      TNumberProps,
      TBooleanProps,
      TDateProps,
      TSubmitProps
    >
  : TValue extends z.ZodEnum<[string, ...string[]]>
  ? ReturnType<
      RendererMap<
        TEnumProps,
        TStringProps,
        TNumberProps,
        TBooleanProps,
        TDateProps,
        TSubmitProps
      >["Enum"]
    >
  : TValue extends z.ZodDate
  ? ReturnType<
      RendererMap<
        TEnumProps,
        TStringProps,
        TNumberProps,
        TBooleanProps,
        TDateProps,
        TSubmitProps
      >["Date"]
    >
  : TValue extends z.ZodType<string>
  ? ReturnType<
      RendererMap<
        TEnumProps,
        TStringProps,
        TNumberProps,
        TBooleanProps,
        TDateProps,
        TSubmitProps
      >["String"]
    >
  : TValue extends z.ZodType<number>
  ? ReturnType<
      RendererMap<
        TEnumProps,
        TStringProps,
        TNumberProps,
        TBooleanProps,
        TDateProps,
        TSubmitProps
      >["Number"]
    >
  : TValue extends z.ZodType<boolean>
  ? ReturnType<
      RendererMap<
        TEnumProps,
        TStringProps,
        TNumberProps,
        TBooleanProps,
        TDateProps,
        TSubmitProps
      >["Boolean"]
    >
  : ReturnType<
      RendererMap<
        TEnumProps,
        TStringProps,
        TNumberProps,
        TBooleanProps,
        TDateProps,
        TSubmitProps
      >["Default"]
    >;

export const useFormRenderer = <
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string,
  TEnumProps,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TDateProps,
  TSubmitProps
>(
  schema: z.ZodObject<TShape> | z.ZodEffects<z.ZodObject<TShape>>,
  renderers: RendererMap<
    TEnumProps,
    TStringProps,
    TNumberProps,
    TBooleanProps,
    TDateProps,
    TSubmitProps
  >
) => {
  const shape = isZodEffects(schema) ? schema._def.schema.shape : schema.shape;

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  type Controls = {
    Submit: RendererMap<
      TEnumProps,
      TStringProps,
      TNumberProps,
      TBooleanProps,
      TDateProps,
      TSubmitProps
    >["Submit"];
  } & {
    [K in Capitalize<TKey>]: TRenderer<
      TShape[Uncapitalize<K>],
      TEnumProps,
      TStringProps,
      TNumberProps,
      TBooleanProps,
      TDateProps,
      TSubmitProps
    >;
  };

  const controls = Object.entries(shape).reduce(
    (ctrls, [key, value]) => {
      return { ...ctrls, [capitalize(key)]: mapToRenderer(value, renderers) };
    },
    {
      // Always include the submit button.
      Submit: renderers.Submit,
    } as Controls
  );

  return controls;
};
