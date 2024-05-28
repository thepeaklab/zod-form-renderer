import { FormRenderer } from "@src/form-renderer";
import { z } from "zod";
import { rendererMap } from "../renderer-map";
import { primitives } from "../schemas/primitives";

export const PrimitivesForm = ({
  onSubmit,
}: {
  onSubmit: (d: z.infer<typeof primitives>) => void;
}) => (
  <FormRenderer
    schema={primitives}
    typeRendererMap={rendererMap}
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
