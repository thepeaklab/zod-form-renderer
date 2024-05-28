import { useFieldRendererContext } from "@src/context";
import { ComponentPropsWithRef } from "react";

export type DatepickerRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const DatepickerRenderer = (props: DatepickerRendererProps) => {
  const { name, form } = useFieldRendererContext();

  return (
    <div>
      <label htmlFor={name}>{props.label}</label>
      <br />
      <input
        id={name}
        type="date"
        {...form.register(name, { valueAsDate: true })}
        {...props}
      />
    </div>
  );
};
