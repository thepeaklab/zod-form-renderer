import { z } from "zod";
import { FieldRendererContext } from "./renderer-mapper";
import { TRenderer, useFormRenderer } from "./use-form-renderer";

export type FieldRenderer<TProps> = (
  context: FieldRendererContext
) => (props: TProps) => React.ReactNode;

export type RendererMap<TEnumProps, TStringProps, TNumberProps, TBooleanProps> =
  {
    Enum: FieldRenderer<TEnumProps>;
    String: FieldRenderer<TStringProps>;
    Number: FieldRenderer<TNumberProps>;
    Boolean: FieldRenderer<TBooleanProps>;
    Default: FieldRenderer<void>;
  };

export type FormRendererProps<
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string,
  TEnumProps,
  TStringProps,
  TNumberProps,
  TBooleanProps
> = {
  schema: z.ZodObject<TShape> | z.ZodEffects<z.ZodObject<TShape>>;
  renderers: RendererMap<TEnumProps, TStringProps, TNumberProps, TBooleanProps>;
  children: (controls: {
    [K in Capitalize<TKey>]: TRenderer<
      TShape[Uncapitalize<K>],
      TEnumProps,
      TStringProps,
      TNumberProps,
      TBooleanProps
    >;
  }) => React.ReactNode;
};

export const FormRenderer = <
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string,
  TEnumProps,
  TStringProps,
  TNumberProps,
  TBooleanProps
>({
  schema,
  renderers,
  children,
}: FormRendererProps<
  TShape,
  TKey,
  TEnumProps,
  TStringProps,
  TNumberProps,
  TBooleanProps
>) => {
  const controls = useFormRenderer(schema, renderers);

  return children(controls);
};
