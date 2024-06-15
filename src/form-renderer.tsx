import React from "react";
import { UseFormProps, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FieldRenderer, RendererMap } from "./renderer-map";
import { TSchema, useFormRenderer } from "./use-form-renderer";

// We allow all props to be passed through, except for children and onSubmit.
type NativeFormProps = Omit<
  React.ComponentPropsWithRef<"form">,
  "children" | "onSubmit"
>;

type FormRendererProps<
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string,
  TCustomKey extends keyof TShape & string,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TEnumProps,
  TDateProps,
  TSubmitProps
> = NativeFormProps & {
  schema: TSchema<TShape>;
  typeRendererMap: RendererMap<
    TStringProps,
    TNumberProps,
    TBooleanProps,
    TEnumProps,
    TDateProps,
    TSubmitProps
  >;
  fieldRendererMap?: Partial<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in TCustomKey]: FieldRenderer<any>;
  }>;
  useFormProps?: UseFormProps<z.infer<TSchema<TShape>>>;
  onSubmit: (
    data: z.infer<TSchema<TShape>>,
    form: UseFormReturn<z.infer<TSchema<TShape>>>
  ) => void;
  children: (
    formControls: ReturnType<
      typeof useFormRenderer<
        TShape,
        TKey,
        TCustomKey,
        z.infer<TSchema<TShape>>,
        TStringProps,
        TNumberProps,
        TBooleanProps,
        TEnumProps,
        TDateProps,
        TSubmitProps
      >
    >
  ) => React.ReactNode;
};

/**
 * This components translates a zod validation schema into a set of form controls
 * by inferring the correct renderer for each field type.
 * Please note, that this only works for primitive types and enums.
 *
 * It wraps the controls in a form tag, which can be customized with the formProps prop.
 * To create a type renderer map, use the @see createRendererMap function.
 */
export const FormRenderer = <
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string,
  TCustomKey extends keyof TShape & string,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TEnumProps,
  TDateProps,
  TSubmitProps
>({
  schema,
  typeRendererMap,
  fieldRendererMap = {},
  useFormProps = {},
  onSubmit,
  children,
  ...rest
}: FormRendererProps<
  TShape,
  TKey,
  TCustomKey,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TEnumProps,
  TDateProps,
  TSubmitProps
>) => {
  const { form, controls } = useFormRenderer(
    schema,
    typeRendererMap,
    fieldRendererMap,
    useFormProps
  );

  return (
    <form
      {...rest}
      onSubmit={form.handleSubmit((data) => onSubmit(data, form))}
    >
      {children({ form, controls })}
    </form>
  );
};
