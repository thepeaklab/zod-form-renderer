import { ComponentPropsWithRef } from "react";
import { FieldRendererContext } from "../lib/renderer-map";

export type DatepickerRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const DatepickerRenderer =
  ({ name, register }: FieldRendererContext) =>
  (userOptions: DatepickerRendererProps) => {
    const options = { name, ...userOptions };

    return (
      <div>
        <label htmlFor={name}>{options.label}</label>
        <br />
        <input id={name} {...register(name)} type="date" {...options} />
      </div>
    );
  };
