import { FormRenderer } from "@src/form-renderer";
import { z } from "zod";
import { rendererMap } from "../renderer-map";
import { complex, complexWithEffects } from "../schemas/complex";

export const ComplexForm = ({
  onSubmit,
}: {
  onSubmit: (d: z.infer<typeof complex>) => void;
}) => (
  <FormRenderer
    schema={complexWithEffects}
    typeRendererMap={rendererMap}
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
