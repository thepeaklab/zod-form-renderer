import { ComponentPropsWithRef } from "react";
import { FieldRendererContext } from "../../../src/renderer-map";

export type SelectRendererProps = ComponentPropsWithRef<"select"> & {
  label: string;
  options: { value: string; label: string }[];
};

export const SelectRenderer =
  ({ name, form }: FieldRendererContext) =>
  (props: SelectRendererProps) => {
    return (
      <div>
        <label htmlFor={name}>{props.label}: </label>
        <br />
        <select id={name} {...form.register(name)} {...props}>
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
