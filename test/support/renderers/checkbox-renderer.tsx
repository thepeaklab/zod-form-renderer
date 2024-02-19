import { ComponentPropsWithRef } from "react";
import { FieldRendererContext } from "../../../src/renderer-map";

export type CheckboxRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const CheckboxRenderer =
  ({ name, form }: FieldRendererContext) =>
  (props: CheckboxRendererProps) => {
    return (
      <label htmlFor={name}>
        <input id={name} type="checkbox" {...form.register(name)} {...props} />
        {props.label}
      </label>
    );
  };
