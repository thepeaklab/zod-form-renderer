import { z } from "zod";
import { FormRenderer } from "../../../src";
import { rendererMap } from "../renderer-map";

export const primitives = z.object({
  title: z.enum(["", "Dr.", "Prof."]),
  name: z.string(),
  birthday: z.coerce.date(),
  age: z.number(),
  accept: z.boolean(),
});

export const PrimitivesForm = ({
  onSubmit,
}: {
  onSubmit: (d: z.infer<typeof primitives>) => void;
}) => (
  <FormRenderer
    schema={primitives}
    rendererMap={rendererMap}
    useFormProps={{
      defaultValues: {
        name: "John Doe",
      },
    }}
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
