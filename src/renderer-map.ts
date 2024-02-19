import { FieldValues, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { isBoolean, isDate, isEnum, isNumber, isString } from "./typeguards";

/** This context will be provided to any field renderer. */
export type FieldRendererContext = {
  /** User-defined name of the form field. */
  name: string;
  /** User-defined zod validation schema of the form field. */
  schema: z.ZodTypeAny;
  /** React-hook-form context. */
  form: UseFormReturn<FieldValues>;
};

/**
 * The user has to define a matching field renderer for every supported zod type.
 * It receives a validation context and returns any form field component.
 */
export type FieldRenderer<TProps> = (
  context: FieldRendererContext
) => (props: TProps) => React.ReactNode;

/**
 * This renderer map is used to map supported zod types to field renderers.
 * The user has to define a matching field renderer for every supported zod type.
 * Additionally, a default renderer and a submit button are required.
 *
 * The typing looks a bit verbose, but it is necessary to infer the correct
 * props for each field renderer.
 * Use @see createRendererMap to avoid manual typing.
 */
export type RendererMap<
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TEnumProps,
  TDateProps,
  TSubmitProps
> = {
  String: FieldRenderer<TStringProps>;
  Number: FieldRenderer<TNumberProps>;
  Boolean: FieldRenderer<TBooleanProps>;
  Enum: FieldRenderer<TEnumProps>;
  Date: FieldRenderer<TDateProps>;
  Default: FieldRenderer<unknown>;
  Submit: (props: TSubmitProps) => React.ReactNode;
};

/**
 * This renderer map is used to map supported zod types to field renderers.
 * Additionally, a default renderer and a submit button are required.
 */
export function createRendererMap<
  // We can use `never` here because we are not interested in the actual renderer props type.
  TMap extends RendererMap<never, never, never, never, never, never>
>(map: TMap): TMap {
  // This function is only used for type inference and an easier lib interface.
  return map;
}

/**
 * Returns a field renderer for a given zod type and injects the validation context.
 * If not found, returns the default renderer.
 */
export const mapToRenderer = <TSchema extends z.ZodTypeAny>(
  name: string,
  schema: TSchema,
  rendererMap: ReturnType<typeof createRendererMap>,
  form: UseFormReturn<FieldValues>
) => {
  // This context will be provided to every field renderer.
  const context: FieldRendererContext = { name, schema, form };

  if (isEnum(schema)) {
    return rendererMap.Enum(context);
  }

  if (isDate(schema)) {
    return rendererMap.Date(context);
  }

  if (isString(schema)) {
    return rendererMap.String(context);
  }

  if (isNumber(schema)) {
    return rendererMap.Number(context);
  }

  if (isBoolean(schema)) {
    return rendererMap.Boolean(context);
  }

  return rendererMap.Default(context);
};
