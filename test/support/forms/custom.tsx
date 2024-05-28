import { useFieldRendererContext } from "@src/context";
import { FormRenderer } from "@src/form-renderer";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { rendererMap } from "../renderer-map";
import { nonPrimitive } from "../schemas/custom";

const FileUploadRenderer = () => {
  const { form } = useFieldRendererContext();

  return (
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
  );
};

export const CustomForm = ({
  onSubmit,
}: {
  onSubmit: (d: z.infer<typeof nonPrimitive>) => void;
}) => (
  <FormRenderer
    schema={nonPrimitive}
    typeRendererMap={rendererMap}
    fieldRendererMap={{
      profileImage: FileUploadRenderer,
    }}
    onSubmit={onSubmit}
  >
    {({ controls: Controls }) => (
      <>
        <Controls.ProfileImage />
        <Controls.Submit>Submit</Controls.Submit>
      </>
    )}
  </FormRenderer>
);

export const NonPrimitiveForm = ({
  onSubmit,
}: {
  onSubmit: (d: z.infer<typeof nonPrimitive>) => void;
}) => (
  <FormRenderer
    schema={nonPrimitive}
    typeRendererMap={rendererMap}
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
