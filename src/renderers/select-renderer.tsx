import { ComponentPropsWithRef } from "react";
import { FieldRendererContext } from "../lib/renderer-map";

export type SelectRendererProps = ComponentPropsWithRef<"select"> & {
  label: string;
  options: { value: string; label: string }[];
};

export const SelectRenderer =
  ({ name, register }: FieldRendererContext) =>
  (props: SelectRendererProps) => {
    const options = { name, ...props };

    return (
      <div>
        <label htmlFor={name}>{options.label}: </label>
        <br />
        <select id={name} {...register(name)} {...props}>
          {options.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
