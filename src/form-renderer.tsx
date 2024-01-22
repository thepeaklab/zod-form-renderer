import { z } from "zod";
import { TRenderer, useFormRenderer } from "./use-form-renderer";

export type FormRendererProps<
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string
> = {
  schema: z.ZodObject<TShape> | z.ZodEffects<z.ZodObject<TShape>>;
  children: (controls: {
    [K in Capitalize<TKey>]: TRenderer<TShape[Uncapitalize<K>]>;
  }) => React.ReactNode;
};

export const FormRenderer = <
  TShape extends z.ZodRawShape,
  TKey extends keyof TShape & string
>({
  schema,
  children,
}: FormRendererProps<TShape, TKey>) => {
  const controls = useFormRenderer(schema);

  return children(controls);
};
