import { z } from "zod";
import { CheckboxRenderer } from "./renderers/checkbox-renderer";
import { InputRenderer } from "./renderers/input-renderer";
import { NullRenderer } from "./renderers/null-renderer";
import { SelectRenderer } from "./renderers/select-renderer";
import { isBoolean, isEnum, isNumber, isString } from "./typeguards";

export type FieldRendererContext = {
  name: string;
  schema: z.ZodTypeAny;
};

export const mapToRenderer = <TValue extends z.ZodTypeAny>(value: TValue) => {
  const context: FieldRendererContext = {
    name: value._def.name,
    schema: value,
  };

  if (isEnum(value)) {
    return SelectRenderer(context);
  }

  if (isString(value) || isNumber(value)) {
    return InputRenderer(context);
  }

  if (isBoolean(value)) {
    return CheckboxRenderer(context);
  }

  console.log("No renderer found for", value._def.typeName);
  return NullRenderer;
};
