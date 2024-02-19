import { z } from "zod";
import { FormRenderer } from "../../../src";
import { rendererMap } from "../renderer-map";

export const complex = z.object({
  title: z.enum(["", "Dr.", "Prof."]).optional(),
  name: z.string().min(3).max(30),
  birthday: z.coerce.date().max(new Date()).nullable(),
  age: z.number().min(18).nullable(),
  accept: z.boolean().refine((b) => b === true),
});

export const complexWithEffects = complex.refine((data) => {
  return data.birthday !== null || data.age !== null;
});

export const ComplexForm = ({
  onSubmit,
}: {
  onSubmit: (d: z.infer<typeof complex>) => void;
}) => (
  <FormRenderer
    schema={complexWithEffects}
    rendererMap={rendererMap}
    onSubmit={onSubmit}
  >
    {({ controls: { Title, Name, Birthday, Age, Accept, Submit } }) => (
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
        <Accept label="Accept" />
        <Submit>Submit</Submit>
      </>
    )}
  </FormRenderer>
);
