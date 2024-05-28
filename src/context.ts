import { createContext, useContext } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { z } from "zod";

/** This context will be provided to any field renderer. */
export type FieldRendererContext = {
  /** User-defined name of the form field. */
  name: string;
  /** User-defined zod validation schema of the form field. */
  schema: z.ZodTypeAny;
  /** React-hook-form context. */
  form: UseFormReturn<FieldValues>;
};

export const FieldContext = createContext<FieldRendererContext | undefined>(
  undefined
);

/** Injects the current field context into the renderer. */
export const useFieldRendererContext = () => {
  const context = useContext(FieldContext);

  if (context === undefined) {
    throw new Error(
      "'useFieldRendererContext' must be used within a FormRenderer component."
    );
  }

  return context;
};
