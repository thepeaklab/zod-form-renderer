import { ComponentPropsWithRef } from "react";
import { FieldRendererContext } from "../lib/renderer-map";

export type CheckboxRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const CheckboxRenderer =
  ({ name }: FieldRendererContext) =>
  (props: CheckboxRendererProps) => {
    const options = { name, type: "checkbox", ...props };

    return (
      <label htmlFor={options.name}>
        <input {...options} />
        {options.label}
      </label>
    );
  };
