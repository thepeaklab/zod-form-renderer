import { z } from "zod";
import { CheckboxRenderer } from "./renderers/checkbox-renderer";
import { InputRenderer } from "./renderers/input-renderer";
import { NullRenderer } from "./renderers/null-renderer";
import { SelectRenderer } from "./renderers/select-renderer";
import { isBoolean, isEnum, isNumber, isString } from "./typeguards";

export type FieldRendererProps = {
  name: string;
  schema: z.ZodTypeAny;
};

export const mapToRenderer = <TValue extends z.ZodTypeAny>(value: TValue) => {
  const name = value._def.name;
  const schema = value;

  if (isEnum(value)) {
    return SelectRenderer({ name, schema });
  }

  if (isString(value)) {
    const type = value.isEmail ? "email" : value.isURL ? "url" : "text";
    return InputRenderer({ name, schema, type });
  }

  if (isNumber(value)) {
    return InputRenderer({ name, schema, type: "number" });
  }

  if (isBoolean(value)) {
    return CheckboxRenderer({ name, schema });
  }

  console.log("No renderer found for", value._def.typeName);
  return NullRenderer;
};
