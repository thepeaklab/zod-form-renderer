import { ComponentPropsWithRef } from "react";
import { z } from "zod";

export type FieldRendererProps = {
  name: string;
  schema: z.ZodTypeAny;
};

export const NullRenderer = () => () => null;

type InputRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

type InputFieldRendererProps = FieldRendererProps & {
  type: ComponentPropsWithRef<"input">["type"];
};

export const InputRenderer =
  ({ name, type, schema }: InputFieldRendererProps) =>
  (userOptions: InputRendererProps) => {
    const options = { name, type, ...userOptions };

    return (
      <div>
        <label htmlFor={name}>
          {options.label}
          {schema.isOptional() && ` (Optional)`}:{" "}
        </label>
        <br />
        <input {...options} />
      </div>
    );
  };

type CheckboxRendererOptions = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const CheckboxRenderer =
  ({ name }: FieldRendererProps) =>
  (userOptions: CheckboxRendererOptions) => {
    const options = { name, type: "checkbox", ...userOptions };

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

export const SelectRenderer =
  <TValue extends SelectOptionValue>({ name }: FieldRendererProps) =>
  (userOptions: SelectRendererOptions<TValue>) => {
    const options = { name, ...userOptions };

    return (
      <div>
        <label htmlFor={options.name}>{options.label}: </label>
        <br />
        <select {...userOptions}>
          {options.options.map((option) => (
            <option key={option.value?.toString()} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
