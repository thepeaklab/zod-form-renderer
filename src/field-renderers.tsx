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
  ({ name, type }: InputFieldRendererProps) =>
  (options: InputRendererProps) => {
    return (
      <div>
        <label htmlFor={name}>{options.label}: </label>
        <br />
        <input name={name} type={type} {...options} />
      </div>
    );
  };

type CheckboxRendererOptions = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const CheckboxRenderer =
  (props: FieldRendererProps) => (userOptions: CheckboxRendererOptions) => {
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

export const SelectRenderer =
  <TValue extends SelectOptionValue>(props: FieldRendererProps) =>
  (userOptions: SelectRendererOptions<TValue>) => {
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
