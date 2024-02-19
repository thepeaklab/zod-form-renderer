import { ComponentPropsWithRef } from "react";
import { Controller } from "react-hook-form";
import { FieldRendererContext } from "../../../src/renderer-map";

export type NumberRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const NumberRenderer =
  ({ name, form }: FieldRendererContext) =>
  (props: NumberRendererProps) => {
    return (
      <Controller
        name={name}
        control={form.control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <div>
            <label htmlFor={name}>{props.label}</label>
            <br />

            <input
              id={name}
              type="number"
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
              {...props}
            />
            <br />
            <p style={{ color: "red" }}>{fieldState.error?.message}</p>
          </div>
        )}
      />
    );
  };
