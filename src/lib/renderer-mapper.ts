import { z } from "zod";
import { RendererMap } from "./form-renderer";
import { isBoolean, isDate, isEnum, isNumber, isString } from "./typeguards";

export type FieldRendererContext = {
  name: string;
  schema: z.ZodTypeAny;
};

export const mapToRenderer = <
  TValue extends z.ZodTypeAny,
  TEnumProps,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TDateProps,
  TSubmitProps
>(
  value: TValue,
  rendererMap: RendererMap<
    TEnumProps,
    TStringProps,
    TNumberProps,
    TBooleanProps,
    TDateProps,
    TSubmitProps
  >
) => {
  const context: FieldRendererContext = {
    name: value._def.name,
    schema: value,
  };

  if (isEnum(value)) {
    return rendererMap.Enum(context);
  }

  if (isDate(value)) {
    return rendererMap.Date(context);
  }

  if (isString(value)) {
    return rendererMap.String(context);
  }

  if (isNumber(value)) {
    return rendererMap.Number(context);
  }

  if (isBoolean(value)) {
    return rendererMap.Boolean(context);
  }

  console.log("No renderer found for", value._def.typeName);
  return rendererMap.Default(context);
};
