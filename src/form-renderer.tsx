import React from 'react';
import { UseFormProps, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FieldRenderer, RendererMap } from './renderer-map';
import { TRenderer, TSchema, useFormRenderer } from './use-form-renderer';

// We allow all props to be passed through, except for children and onSubmit.
type NativeFormProps = Omit<
  React.ComponentPropsWithRef<'form'>,
  'children' | 'onSubmit'
>;

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
  TFormValues extends z.infer<TSchema<TShape>>,
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
}: NativeFormProps & {
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
  useFormProps?: UseFormProps<TFormValues>;
  onSubmit: (data: TFormValues, form: UseFormReturn<TFormValues>) => void;
  children: (children: {
    controls: {
      Submit: RendererMap<
        TStringProps,
        TNumberProps,
        TBooleanProps,
        TEnumProps,
        TDateProps,
        TSubmitProps
      >['Submit'];
    } & {
      [K in Capitalize<TKey>]: Uncapitalize<K> extends keyof Partial<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [K in TCustomKey]: FieldRenderer<any>;
      }>
        ? Partial<{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [K in TCustomKey]: FieldRenderer<any>;
          }>[Uncapitalize<K>] extends never
          ? never
          : <TProps>(props: TProps) => React.ReactNode
        : TRenderer<
            TShape[Uncapitalize<K>],
            RendererMap<
              TStringProps,
              TNumberProps,
              TBooleanProps,
              TEnumProps,
              TDateProps,
              TSubmitProps
            >
          >;
    };
    form: UseFormReturn<TFormValues>;
  }) => React.ReactNode;
}) => {
  // Force the consumer-facing controls object into the correct shape.
  type TControls = Parameters<typeof children>[0]['controls'];

  const { form, controls } = useFormRenderer<
    TShape,
    TCustomKey,
    TFormValues,
    TControls,
    TStringProps,
    TNumberProps,
    TBooleanProps,
    TEnumProps,
    TDateProps,
    TSubmitProps
  >(schema, typeRendererMap, fieldRendererMap, useFormProps);

  return (
    <form
      {...rest}
      onSubmit={form.handleSubmit((data) => onSubmit(data, form))}
    >
      {children({ controls, form })}
    </form>
  );
};
