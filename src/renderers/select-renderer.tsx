import { ComponentPropsWithRef } from "react";
import { FieldRendererContext } from "../lib/renderer-mapper";

type SelectOptionValue = ComponentPropsWithRef<"option">["value"];

type SelectRendererProps<TValue extends SelectOptionValue> =
  ComponentPropsWithRef<"select"> & {
    label: string;
    options: { value: TValue; label: string }[];
  };

export const SelectRenderer =
  <TValue extends SelectOptionValue>({ name }: FieldRendererContext) =>
  (userOptions: SelectRendererProps<TValue>) => {
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
