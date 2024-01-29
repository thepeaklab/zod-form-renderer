import { ComponentPropsWithRef } from "react";
import { FieldRendererContext } from "../lib/renderer-mapper";

type InputRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const InputRenderer =
  ({ name, schema }: FieldRendererContext) =>
  (userOptions: InputRendererProps) => {
    const options = { name, ...userOptions };

    return (
      <div>
        <label htmlFor={name}>
          {options.label}
          {schema.isOptional() && ` (Optional)`}:{" "}
        </label>
        <br />
        <input {...options} />
      </div>
    );
  };
