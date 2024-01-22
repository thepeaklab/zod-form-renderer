import { ComponentPropsWithRef } from "react";
import { FieldRendererProps } from "../renderer-mapper";

type InputRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

type InputFieldRendererProps = FieldRendererProps & {
  type: ComponentPropsWithRef<"input">["type"];
};

export const InputRenderer =
  ({ name, type, schema }: InputFieldRendererProps) =>
  (userOptions: InputRendererProps) => {
    const options = { name, type, ...userOptions };

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
