import { ComponentPropsWithRef } from "react";
import { FieldRendererContext } from "../lib/renderer-mapper";

export type SelectRendererProps = ComponentPropsWithRef<"select"> & {
  label: string;
  options: { value: string; label: string }[];
};

export const SelectRenderer =
  ({ name }: FieldRendererContext) =>
  (props: SelectRendererProps) => {
    const options = { name, ...props };

    return (
      <div>
        <label htmlFor={options.name}>{options.label}: </label>
        <br />
        <select {...props}>
          {options.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
