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

/**
 * Define a renderer map for any zod type that we can infer automatically.
 * Additionally, a default renderer and a submit button are required.
 */
export function createRendererMap<
  // We can use `never` here because we are not interested in the actual renderer props type.
  T extends RendererMap<never, never, never, never, never, never>
>(map: T): T {
  return map;
}

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
