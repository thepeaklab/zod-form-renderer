import { ComponentPropsWithRef } from "react";
import { FieldRendererProps } from "../renderer-mapper";

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
