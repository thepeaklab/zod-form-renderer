import { Controller } from "react-hook-form";
import { z } from "zod";
import { FormRenderer } from "../src/form-renderer";
import { createRendererMap } from "../src/renderer-map";
import { CheckboxRenderer } from "../test/support/renderers/checkbox-renderer";
import { DatepickerRenderer } from "../test/support/renderers/datepicker-renderer";
import { NullRenderer } from "../test/support/renderers/null-renderer";
import { NumberRenderer } from "../test/support/renderers/number-renderer";
import { SelectRenderer } from "../test/support/renderers/select-renderer";
import { SubmitButton } from "../test/support/renderers/submit-renderer";
import { TextRenderer } from "../test/support/renderers/text-renderer";

const fieldRenderers = createRendererMap({
  Enum: SelectRenderer,
  String: TextRenderer,
  Number: NumberRenderer,
  Boolean: CheckboxRenderer,
  Date: DatepickerRenderer,
  Default: NullRenderer,
  Submit: SubmitButton,
});

export const App = () => {
  const schema = z.object({
    title: z.enum(["", "Dr.", "Prof."]).optional(),
    name: z.string().min(3).max(30),
    birthday: z.coerce.date().max(new Date()).nullable(),
    age: z.number().min(18).nullable(),
    avatar: z
      .custom<File>()
      .optional()
      .refine((file) => file?.type?.endsWith("png")),
    accept: z.boolean().refine((b) => b === true),
  });

  const schemaWithEffects = schema.refine((data) => {
    return data.birthday !== null || data.age !== null;
  });

  return (
    <FormRenderer
      schema={schemaWithEffects}
      rendererMap={fieldRenderers}
      useFormProps={{
        mode: "onChange",
      }}
      onSubmit={(data) => {
        console.log(data);
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "sans-serif",
        rowGap: "2rem",
      }}
    >
      {({ controls: { Title, Name, Birthday, Age, Accept, Submit }, form }) => (
        <>
          <Title
            label="Title"
            options={[
              { value: "", label: "None" },
              { value: "Dr.", label: "Dr." },
              { value: "Prof.", label: "Prof." },
            ]}
          />
          <Name label="Name" />
          <Birthday label="Birthday" />
          <Age label="Age" />

          {/* Inserting custom fields is always possible. */}
          <Controller
            name="avatar"
            control={form.control}
            render={({ field }) => (
              <label htmlFor="avatar">
                <input
                  id="avatar"
                  type="file"
                  onBlur={field.onBlur}
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </label>
            )}
          />

          <Accept label="Accept privacy policy" />

          <Submit>Submit</Submit>
        </>
      )}
    </FormRenderer>
  );
};
