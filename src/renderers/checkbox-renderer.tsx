import { ComponentPropsWithRef } from "react";
import { FieldRendererContext } from "../renderer-mapper";

type CheckboxRendererOptions = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const CheckboxRenderer =
  ({ name }: FieldRendererContext) =>
  (userOptions: CheckboxRendererOptions) => {
    const options = { name, type: "checkbox", ...userOptions };

    return (
      <label htmlFor={options.name}>
        <input {...options} />
        {options.label}
      </label>
    );
  };
