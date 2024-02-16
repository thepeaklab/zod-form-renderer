import { ComponentPropsWithRef } from "react";
import { FieldRendererContext } from "../lib/renderer-map";

export type InputRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const InputRenderer =
  ({ name, schema, register }: FieldRendererContext) =>
  (options: InputRendererProps) => {
    return (
      <div>
        <label htmlFor={name}>
          {options.label}
          {schema.isOptional() && ` (Optional)`}
        </label>
        <br />
        <input
          id={name}
          {...options}
          {...register(name, {
            valueAsNumber: options.type === "number",
          })}
        />
      </div>
    );
  };
