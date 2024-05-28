import { useFieldRendererContext } from "@src/context";
import { ComponentPropsWithRef } from "react";

export type CheckboxRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const CheckboxRenderer = (props: CheckboxRendererProps) => {
  const { name, form } = useFieldRendererContext();

  return (
    <label htmlFor={name}>
      <input id={name} type="checkbox" {...form.register(name)} {...props} />
      {props.label}
    </label>
  );
};
