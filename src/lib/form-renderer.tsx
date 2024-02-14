import React from "react";
import { z } from "zod";
import { FieldRendererContext } from "./renderer-mapper";
import { useFormRenderer } from "./use-form-renderer";

export type FieldRenderer<TProps> = (
  context: FieldRendererContext
) => (props: TProps) => React.ReactNode;

export type RendererMap<
  TEnumProps,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TDateProps,
  TSubmitProps
> = {
  Enum: FieldRenderer<TEnumProps>;
  String: FieldRenderer<TStringProps>;
  Number: FieldRenderer<TNumberProps>;
  Boolean: FieldRenderer<TBooleanProps>;
  Date: FieldRenderer<TDateProps>;
  Default: FieldRenderer<void>;
  Submit: (props: TSubmitProps) => React.ReactNode;
};

export type FormRendererProps<
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string,
  TEnumProps,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TDateProps,
  TSubmitProps
> = {
  schema: z.ZodObject<TShape> | z.ZodEffects<z.ZodObject<TShape>>;
  renderers: RendererMap<
    TEnumProps,
    TStringProps,
    TNumberProps,
    TBooleanProps,
    TDateProps,
    TSubmitProps
  >;
  formProps?: React.ComponentPropsWithRef<"form">;
  children: (
    controls: ReturnType<
      typeof useFormRenderer<
        TShape,
        TKey,
        TEnumProps,
        TStringProps,
        TNumberProps,
        TBooleanProps,
        TDateProps,
        TSubmitProps
      >
    >
  ) => React.ReactNode;
};

export const FormRenderer = <
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string,
  TEnumProps,
  TStringProps,
  TNumberProps,
  TBooleanProps,
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
  TEnumProps,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TDateProps,
  TSubmitProps
>) => {
  const controls = useFormRenderer(schema, renderers);

  return <form {...formProps}>{children(controls)}</form>;
};
