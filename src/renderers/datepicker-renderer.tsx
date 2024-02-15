import { ComponentPropsWithRef } from "react";
import { FieldRendererContext } from "../lib/renderer-map";

export type DatepickerRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const DatepickerRenderer =
  ({ name }: FieldRendererContext) =>
  (userOptions: DatepickerRendererProps) => {
    const options = { name, ...userOptions };

    return (
      <div>
        <label htmlFor={name}>{options.label}</label>
        <br />
        <input type="date" {...options} />
      </div>
    );
  };
