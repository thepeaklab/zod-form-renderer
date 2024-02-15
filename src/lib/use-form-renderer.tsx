import { z } from "zod";
import { RendererMap, createRendererMap, mapToRenderer } from "./renderer-map";
import { isZodEffects } from "./typeguards";

export type TSchema<TShape extends z.ZodRawShape> =
  | z.ZodObject<TShape>
  | z.ZodEffects<z.ZodObject<TShape>>;

/**
 * This really verbose type mirrors the @see mapToRenderer function
 * and is used to infer the correct renderer type for each field.
 */
type TRenderer<
  TValue,
  TMap extends ReturnType<typeof createRendererMap>
> = TValue extends z.ZodOptional<z.ZodTypeAny> | z.ZodNullable<z.ZodTypeAny>
  ? TRenderer<TValue["_def"]["innerType"], TMap>
  : TValue extends z.ZodEffects<z.ZodTypeAny>
  ? TRenderer<TValue["_def"]["schema"], TMap>
  : TValue extends z.ZodEnum<[string, ...string[]]>
  ? ReturnType<TMap["Enum"]>
  : TValue extends z.ZodDate
  ? ReturnType<TMap["Date"]>
  : TValue extends z.ZodType<string>
  ? ReturnType<TMap["String"]>
  : TValue extends z.ZodType<number>
  ? ReturnType<TMap["Number"]>
  : TValue extends z.ZodType<boolean>
  ? ReturnType<TMap["Boolean"]>
  : ReturnType<TMap["Default"]>;

/**
 * This hook translates a zod validation schema into a set of form controls
 * by infering the correct renderer for each field type.
 * Please note, that this only works for primitive types and enums.
 *
 * To create a renderer map, use the @see createRendererMap function.
 */
export const useFormRenderer = <
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TEnumProps,
  TDateProps,
  TSubmitProps
>(
  schema: TSchema<TShape>,
  rendererMap: RendererMap<
    TStringProps,
    TNumberProps,
    TBooleanProps,
    TEnumProps,
    TDateProps,
    TSubmitProps
  >
) => {
  // If a schema has effects (.refine(...)), we have to extract the shape.
  const shape = isZodEffects(schema) ? schema._def.schema.shape : schema.shape;

  // Setup some helper types to make the return type more readable.
  type TMap = typeof rendererMap;

  // For our returned controls type, we also add the submit button.
  type Controls = {
    Submit: TMap["Submit"];
  } & {
    [K in Capitalize<TKey>]: TRenderer<TShape[Uncapitalize<K>], TMap>;
  };

  // This is the magic, we map each field to the correct renderer.
  const controls = Object.entries(shape).reduce(
    (ctrls, [field, fieldSchema]) => ({
      ...ctrls,
      [capitalize(field)]: mapToRenderer(fieldSchema, rendererMap),
    }),
    {
      // Always include the submit button.
      Submit: rendererMap.Submit,
    } as Controls
  );

  return controls;
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
