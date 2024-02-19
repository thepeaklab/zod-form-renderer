import { Controller } from "react-hook-form";
import { z } from "zod";
import { FormRenderer } from "../../../src";
import { rendererMap } from "../renderer-map";

export const nonPrimitive = z.object({
  profileImage: z.custom<File>().refine((file) => file.type.endsWith("png")),
});

export const NonPrimitiveForm = ({
  onSubmit,
}: {
  onSubmit: (d: z.infer<typeof nonPrimitive>) => void;
}) => (
  <FormRenderer
    schema={nonPrimitive}
    rendererMap={rendererMap}
    onSubmit={onSubmit}
  >
    {({ controls: { ProfileImage, Submit } }) => (
      <>
        <ProfileImage />
        <Submit>Submit</Submit>
      </>
    )}
  </FormRenderer>
);

export const CustomForm = ({
  onSubmit,
}: {
  onSubmit: (d: z.infer<typeof nonPrimitive>) => void;
}) => (
  <FormRenderer
    schema={nonPrimitive}
    rendererMap={rendererMap}
    onSubmit={onSubmit}
  >
    {({ controls: { Submit }, form }) => (
      <>
        <Controller
          name="profileImage"
          control={form.control}
          render={({ field }) => (
            <label htmlFor="profileImage">
              Profile Image
              <input
                id="profileImage"
                type="file"
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(e.target.files?.[0])}
              />
            </label>
          )}
        />

        <Submit>Submit</Submit>
      </>
    )}
  </FormRenderer>
);
