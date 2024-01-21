import { z } from "zod";
import {
  CheckboxRenderer,
  InputRenderer,
  NullRenderer,
  SelectRenderer,
} from "./field-renderers";

type TRenderer<TValue> = TValue extends z.ZodEnum<
  infer TEnum extends [string, ...string[]]
>
  ? ReturnType<typeof SelectRenderer<TEnum[number]>>
  : TValue extends z.ZodType<string>
  ? ReturnType<typeof InputRenderer>
  : TValue extends z.ZodType<number>
  ? ReturnType<typeof InputRenderer>
  : TValue extends z.ZodType<boolean>
  ? ReturnType<typeof CheckboxRenderer>
  : ReturnType<typeof NullRenderer>;

export type FormRendererProps<
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string
> = {
  schema: z.ZodObject<TShape> | z.ZodEffects<z.ZodObject<TShape>>;
  children: (controls: {
    [K in Capitalize<TKey>]: TRenderer<TShape[Uncapitalize<K>]>;
  }) => React.ReactNode;
};

export const FormRenderer = <
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string
>({
  schema,
  children,
}: FormRendererProps<TShape, TKey>) => {
  const shape = isZodEffects(schema) ? schema._def.schema.shape : schema.shape;

  const controls = Object.entries(shape).reduce((ctrls, [key, value]) => {
    return { ...ctrls, [capitalize(key)]: findRenderer(value) };
  }, {} as { [K in Capitalize<TKey>]: TRenderer<TShape[Uncapitalize<K>]> });

  return children(controls);
};

const findRenderer = <TValue extends z.ZodTypeAny>(value: TValue) => {
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

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function isZodEffects<T extends z.ZodTypeAny>(
  value: z.ZodTypeAny
): value is z.ZodEffects<T> {
  return value._def.typeName === "ZodEffects";
}

function isString(value: z.ZodTypeAny): value is z.ZodString {
  return value._def.typeName === z.string()._def.typeName;
}

function isNumber(value: z.ZodTypeAny): value is z.ZodNumber {
  return value._def.typeName === z.number()._def.typeName;
}

function isBoolean(value: z.ZodTypeAny): value is z.ZodBoolean {
  return value._def.typeName === z.boolean()._def.typeName;
}

function isEnum<T extends [string, ...string[]]>(
  value: z.ZodTypeAny
): value is z.ZodEnum<T> {
  return value._def.typeName === z.enum([""])._def.typeName;
}
