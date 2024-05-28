import { useFieldRendererContext } from "@src/context";
import { ComponentPropsWithRef } from "react";

export type TextRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const TextRenderer = (props: TextRendererProps) => {
  const { name, schema, form } = useFieldRendererContext();
  const error = form.formState.errors?.[name];

  return (
    <div>
      <label htmlFor={name}>
        {props.label}
        {schema.isOptional() && ` (Optional)`}
      </label>
      <br />

      <input id={name} {...form.register(name)} {...props} />
      <br />
      <p style={{ color: "red" }}>{error?.message?.toString()}</p>
    </div>
  );
};
