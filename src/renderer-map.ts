import React from "react";
import { z } from "zod";
import { isBoolean, isDate, isEnum, isNumber, isString } from "./typeguards";

/**
 * The consumer has to define a matching field renderer for every supported zod type.
 * As an interface, we require a generic React component.
 */
export type FieldRenderer<TProps> = (props: TProps) => React.ReactNode;

/**
 * This renderer map is used to map supported zod types to field renderers.
 * The user has to define a matching field renderer for every supported zod type.
 * Additionally, a default renderer and a submit button are required.
 *
 * Use @see createRendererMap to avoid manual props typing.
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
 * Returns a field renderer for a given zod type.
 * If not found, returns the default renderer.
 */
export const mapToTypeRenderer = (
  schema: z.ZodTypeAny,
  rendererMap: ReturnType<typeof createRendererMap>
) => {
  if (isEnum(schema)) {
    return rendererMap.Enum;
  }

  if (isDate(schema)) {
    return rendererMap.Date;
  }

  if (isString(schema)) {
    return rendererMap.String;
  }

  if (isNumber(schema)) {
    return rendererMap.Number;
  }

  if (isBoolean(schema)) {
    return rendererMap.Boolean;
  }

  return rendererMap.Default;
};
