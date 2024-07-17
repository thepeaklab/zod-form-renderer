import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import {
  FieldValues,
  UseFormProps,
  UseFormReturn,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';
import { FieldContext } from './context';
import {
  FieldRenderer,
  RendererMap,
  createRendererMap,
  mapToTypeRenderer,
} from './renderer-map';
import { isZodEffects } from './typeguards';

/** Generic zod input schema. */
export type TSchema<TShape extends z.ZodRawShape> =
  | z.ZodObject<TShape>
  | z.ZodEffects<z.ZodObject<TShape>>;

/**
 * This really verbose type mirrors the @see mapToTypeRenderer function
 * and is used to infer the correct renderer type for each field.
 */
export type TRenderer<
  TValue,
  TMap extends ReturnType<typeof createRendererMap>
> = TValue extends z.ZodOptional<z.ZodTypeAny> | z.ZodNullable<z.ZodTypeAny>
  ? TRenderer<TValue['_def']['innerType'], TMap>
  : TValue extends z.ZodEffects<z.ZodTypeAny>
  ? TRenderer<TValue['_def']['schema'], TMap>
  : TValue extends z.ZodEnum<[string, ...string[]]>
  ? TMap['Enum']
  : TValue extends z.ZodDate
  ? TMap['Date']
  : TValue extends z.ZodType<string>
  ? TMap['String']
  : TValue extends z.ZodType<number>
  ? TMap['Number']
  : TValue extends z.ZodType<boolean>
  ? TMap['Boolean']
  : TMap['Default'];

/**
 * This hook translates a zod validation schema into a set of form controls
 * by inferring the correct renderer for each field type.
 * Please note, that this only works for primitive types and enums.
 *
 * To create a type renderer map, use the @see createRendererMap function.
 */
export const useFormRenderer = <
  TShape extends z.ZodRawShape,
  TCustomKey extends keyof TShape & string,
  TFormValues extends z.infer<TSchema<TShape>>,
  TControls,
  TStringProps,
  TNumberProps,
  TBooleanProps,
  TEnumProps,
  TDateProps,
  TSubmitProps
>(
  schema: TSchema<TShape>,
  typeRendererMap: RendererMap<
    TStringProps,
    TNumberProps,
    TBooleanProps,
    TEnumProps,
    TDateProps,
    TSubmitProps
  >,
  fieldRendererMap: Partial<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in TCustomKey]: FieldRenderer<any>;
  }>,
  useFormProps: UseFormProps<TFormValues> = {}
) => {
  // If a schema has effects (.refine(...)), we have to extract the shape.
  const shape = isZodEffects(schema) ? schema._def.schema.shape : schema.shape;

  // Set up react hook form with schema validation.
  const form = useForm<TFormValues>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
    ...useFormProps,
  });

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const mapFieldToRenderer = <P extends object>(
    field: TCustomKey,
    fieldSchema: z.ZodTypeAny,
    props: P
  ) => {
    const fieldRenderer = fieldRendererMap?.[field];

    // Use custom field renderer if available, fall back to type-based renderer.
    const renderer =
      fieldRenderer ||
      (mapToTypeRenderer(fieldSchema, typeRendererMap) as FieldRenderer<P>);

    // Provide the field context to access the form state within each field renderer.
    // Use createElement to properly register useFieldRenderer hook.
    return (
      <FieldContext.Provider
        value={{
          name: field,
          schema: fieldSchema,
          // Accept any field values from TShape.
          form: form as UseFormReturn<FieldValues>,
        }}
      >
        {React.createElement(renderer, props)}
      </FieldContext.Provider>
    );
  };

  // This is the magic, we map each field to the correct renderer.
  const controls = Object.entries(shape).reduce(
    (_controls, [field, fieldSchema]) => ({
      ..._controls,
      [capitalize(field)]: <P extends object>(props: P) =>
        mapFieldToRenderer<P>(field as TCustomKey, fieldSchema, props),
    }),
    {
      // Always include the submit button.
      Submit: typeRendererMap.Submit,
    } as TControls
  );

  return { form, controls };
};
