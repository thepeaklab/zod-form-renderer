import { ComponentPropsWithRef } from "react";
import { Controller } from "react-hook-form";
import { FieldRendererContext } from "../../../src/renderer-map";

export type TextRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const TextRenderer =
  ({ name, schema, form }: FieldRendererContext) =>
  (props: TextRendererProps) => {
    return (
      <Controller
        name={name}
        control={form.control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <div>
            <label htmlFor={name}>
              {props.label}
              {schema.isOptional() && ` (Optional)`}
            </label>
            <br />

            <input id={name} {...field} {...props} />
            <br />
            <p style={{ color: "red" }}>{fieldState.error?.message}</p>
          </div>
        )}
      />
    );
  };
