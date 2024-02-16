import { ComponentPropsWithRef } from "react";
import { FieldRendererContext } from "../lib/renderer-map";

export type CheckboxRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const CheckboxRenderer =
  ({ name, register }: FieldRendererContext) =>
  (props: CheckboxRendererProps) => {
    const options = { name, type: "checkbox", ...props };

    return (
      <label htmlFor={name}>
        <input id={name} {...register(name)} {...options} />
        {options.label}
      </label>
    );
  };
