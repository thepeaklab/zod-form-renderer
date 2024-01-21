import { ComponentPropsWithRef } from "react";
import { z } from "zod";

const NullRenderer = () => null;

type InputProps = ComponentPropsWithRef<"input">;

type InputRendererOptions = InputProps & {
  label: string;
};

const InputRenderer =
  (renderOptions: InputProps) => (userOptions: InputRendererOptions) => {
    const options = { ...renderOptions, ...userOptions };

    return (
      <div>
        <label htmlFor={options.name}>{options.label}: </label>
        <br />
        <input {...options} />
      </div>
    );
  };

type CheckboxRendererOptions = InputProps & {
  label: string;
};

const CheckboxRenderer = (userOptions: CheckboxRendererOptions) => {
  const options = { type: "checkbox", ...userOptions };

  return (
    <label htmlFor={options.name}>
      <input {...options} />
      {options.label}
    </label>
  );
};

type SelectOptionValue = ComponentPropsWithRef<"option">["value"];

type SelectRendererOptions<TValue extends SelectOptionValue> =
  ComponentPropsWithRef<"select"> & {
    label: string;
    options: { value: TValue; label: string }[];
  };

const SelectRenderer = <TValue extends SelectOptionValue>(
  userOptions: SelectRendererOptions<TValue>
) => {
  return (
    <div>
      <label htmlFor={userOptions.name}>{userOptions.label}: </label>
      <br />
      <select {...userOptions}>
        {userOptions.options.map((option) => (
          <option key={option.value?.toString()} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

type TRenderer<TValue> = TValue extends z.ZodEnum<
  infer TEnum extends [string, ...string[]]
>
  ? typeof SelectRenderer<TEnum[number]>
  : TValue extends z.ZodType<string>
  ? ReturnType<typeof InputRenderer>
  : TValue extends z.ZodType<number>
  ? ReturnType<typeof InputRenderer>
  : TValue extends z.ZodType<boolean>
  ? typeof CheckboxRenderer
  : typeof NullRenderer;

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
  if (isEnum(value)) {
    return SelectRenderer;
  }

  if (isString(value)) {
    const type = value.isEmail ? "email" : value.isURL ? "url" : "text";
    return InputRenderer({ type });
  }

  if (isNumber(value)) {
    return InputRenderer({ type: "number" });
  }

  if (isBoolean(value)) {
    return CheckboxRenderer;
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
