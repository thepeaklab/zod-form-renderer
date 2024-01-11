import { ComponentPropsWithRef, ComponentPropsWithoutRef } from "react";
import { z } from "zod";

const NullRenderer = () => null;

type InputRendererOptions = ComponentPropsWithRef<"input"> & {
  label: string;
};

const InputRenderer = (options: InputRendererOptions) => {
  return (
    <div>
      <label htmlFor={options.name}>{options.label}: </label>
      <br />
      <input {...options} />
    </div>
  );
};

export function renderForm<
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape
>(schema: z.ZodObject<TShape>) {
  console.log(schema.shape, Object.entries(schema.shape));

  type TRenderer<TValue> = TValue extends z.ZodType<string>
    ? typeof InputRenderer
    : typeof NullRenderer;

  const controls = Object.entries(schema.shape).reduce(
    (ctrls, [key, value]) => {
      return { ...ctrls, [key]: findRenderer(value) };
    },
    {} as { [K in TKey]: TRenderer<TShape[K]> }
  );

  return { controls };
}

const findRenderer = <TValue extends z.ZodTypeAny>(value: TValue) => {
  const type = getInputType(value);

  if (type) {
    return InputRenderer;
  }

  return NullRenderer;
};

// TODO: Make work with effects: https://zod.dev/?id=zodtype-with-zodeffects

type InputControlType = ComponentPropsWithoutRef<"input">["type"];

function getInputType(value: z.ZodTypeAny): InputControlType | null {
  if (isString(value)) {
    if (value.isURL) return "url";
    if (value.isEmail) return "email";
    return "text";
  }

  if (isNumber(value)) {
    return "number";
  }

  return null;
}

function isString(value: z.ZodTypeAny): value is z.ZodString {
  return value._def.typeName === z.string()._def.typeName;
}

function isNumber(value: z.ZodTypeAny): value is z.ZodNumber {
  return value._def.typeName === z.number()._def.typeName;
}

// function isBoolean(value: z.ZodTypeAny): value is z.ZodBoolean {
//   return value._def.typeName === z.boolean()._def.typeName;
// }

// function isEnum<T extends [string, ...string[]]>(
//   value: z.ZodTypeAny
// ): value is z.ZodEnum<T> {
//   return value._def.typeName === z.enum([""])._def.typeName;
// }
