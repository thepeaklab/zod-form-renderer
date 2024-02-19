import { ComponentPropsWithRef } from "react";
import { FieldRendererContext } from "../../../src/renderer-map";

export type DatepickerRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const DatepickerRenderer =
  ({ name, form }: FieldRendererContext) =>
  (props: DatepickerRendererProps) => {
    return (
      <div>
        <label htmlFor={name}>{props.label}</label>
        <br />
        <input
          id={name}
          type="date"
          {...form.register(name, { valueAsDate: true })}
          {...props}
        />
      </div>
    );
  };
