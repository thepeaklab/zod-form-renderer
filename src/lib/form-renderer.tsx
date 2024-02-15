import { z } from "zod";
import { RendererMap } from "./renderer-map";
import { TSchema, useFormRenderer } from "./use-form-renderer";

type FormRendererProps<
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TEnumProps,
  TDateProps,
  TSubmitProps
> = {
  schema: TSchema<TShape>;
  renderers: RendererMap<
    TStringProps,
    TNumberProps,
    TBooleanProps,
    TEnumProps,
    TDateProps,
    TSubmitProps
  >;
  formProps?: React.ComponentPropsWithRef<"form">;
  children: (
    controls: ReturnType<
      typeof useFormRenderer<
        TShape,
        TKey,
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
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TEnumProps,
  TDateProps,
  TSubmitProps
>({
  schema,
  renderers,
  formProps = {},
  children,
}: FormRendererProps<
  TShape,
  TKey,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TEnumProps,
  TDateProps,
  TSubmitProps
>) => {
  const controls = useFormRenderer(schema, renderers);

  return <form {...formProps}>{children(controls)}</form>;
};
