import React from "react";
import { z } from "zod";
import { FieldRendererContext } from "./renderer-mapper";
import { TRenderer, useFormRenderer } from "./use-form-renderer";

export type FieldRenderer<TProps> = (
  context: FieldRendererContext
) => (props: TProps) => React.ReactNode;

export type RendererMap<
  TEnumProps,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TDateProps
> = {
  Enum: FieldRenderer<TEnumProps>;
  String: FieldRenderer<TStringProps>;
  Number: FieldRenderer<TNumberProps>;
  Boolean: FieldRenderer<TBooleanProps>;
  Date: FieldRenderer<TDateProps>;
  Default: FieldRenderer<void>;
};

export type FormRendererProps<
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string,
  TEnumProps,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TDateProps
> = {
  schema: z.ZodObject<TShape> | z.ZodEffects<z.ZodObject<TShape>>;
  renderers: RendererMap<
    TEnumProps,
    TStringProps,
    TNumberProps,
    TBooleanProps,
    TDateProps
  >;
  formProps?: React.ComponentPropsWithRef<"form">;
  children: (controls: {
    [K in Capitalize<TKey>]: TRenderer<
      TShape[Uncapitalize<K>],
      TEnumProps,
      TStringProps,
      TNumberProps,
      TBooleanProps,
      TDateProps
    >;
  }) => React.ReactNode;
};

export const FormRenderer = <
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string,
  TEnumProps,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TDateProps
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
  TDateProps
>) => {
  const controls = useFormRenderer(schema, renderers);

  return <form {...formProps}>{children(controls)}</form>;
};
