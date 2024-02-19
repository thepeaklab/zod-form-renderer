import { UseFormProps } from "react-hook-form";
import { z } from "zod";
import { RendererMap } from "./renderer-map";
import { TSchema, useFormRenderer } from "./use-form-renderer";

// We allow all props to be passed through, except for children and onSubmit.
type NativeFormProps = Omit<
  React.ComponentPropsWithRef<"form">,
  "children" | "onSubmit"
>;

type FormRendererProps<
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string,
  TFormValues extends z.infer<TSchema<TShape>>,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TEnumProps,
  TDateProps,
  TSubmitProps
> = NativeFormProps & {
  schema: TSchema<TShape>;
  rendererMap: RendererMap<
    TStringProps,
    TNumberProps,
    TBooleanProps,
    TEnumProps,
    TDateProps,
    TSubmitProps
  >;
  useFormProps?: UseFormProps<TFormValues>;
  onSubmit: (data: TFormValues) => void;
  children: (
    formControls: ReturnType<
      typeof useFormRenderer<
        TShape,
        TKey,
        TFormValues,
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
 * by infering the correct renderer for each field type.
 * Please note, that this only works for primitive types and enums.
 *
 * It wraps the controls in a form tag, which can be customized with the formProps prop.
 * To create a renderer map, use the @see createRendererMap function.
 */
export const FormRenderer = <
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string,
  TFormValues extends z.infer<TSchema<TShape>>,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TEnumProps,
  TDateProps,
  TSubmitProps
>({
  schema,
  rendererMap,
  useFormProps = {},
  onSubmit,
  children,
  ...rest
}: FormRendererProps<
  TShape,
  TKey,
  TFormValues,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TEnumProps,
  TDateProps,
  TSubmitProps
>) => {
  const { form, controls } = useFormRenderer(schema, rendererMap, useFormProps);

  return (
    <form {...rest} onSubmit={form.handleSubmit(onSubmit)}>
      {children({ form, controls })}
    </form>
  );
};
