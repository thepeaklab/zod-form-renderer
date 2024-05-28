import { useFieldRendererContext } from "@src/context";
import { ComponentPropsWithRef } from "react";

export type NumberRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const NumberRenderer = (props: NumberRendererProps) => {
  const { name, form } = useFieldRendererContext();
  const error = form.formState.errors?.[name];

  return (
    <div>
      <label htmlFor={name}>{props.label}</label>
      <br />

      <input
        id={name}
        type="number"
        {...form.register(name, { valueAsNumber: true })}
        {...props}
      />
      <br />
      <p style={{ color: "red" }}>{!!error && error.message?.toString()}</p>
    </div>
  );
};
