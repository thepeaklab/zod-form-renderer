import { ComponentPropsWithRef } from "react";
import { FieldRendererProps } from "../renderer-mapper";

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
