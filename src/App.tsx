import { z } from "zod";
import { FormRenderer } from "./form-renderer";

export const App = () => {
  const schema = z.object({
    title: z.enum(["Mr", "Mrs", "Miss", "Dr", "Prof"]),
    name: z.string(),
    email: z.string().email(),
    web: z.string().url().optional().nullable(),
    age: z.number(),
    // TODO: Refine auf Feld erkennen!
    // avatar: z.custom<File>().refine((file) => file.type.startsWith("image/")),
    accept: z.boolean(),
  });

  const schemaWithEffects = schema.refine((data) => {
    return data.age > 18;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "2rem" }}>
      <FormRenderer schema={schemaWithEffects}>
        {({ Title, Name, Email, Web, Age, Accept }) => (
          <>
            <Title
              label="Title"
              options={[
                { value: "Mr", label: "Mr." },
                { value: "Mrs", label: "Mrs." },
                { value: "Miss", label: "Miss." },
                { value: "Dr", label: "Dr." },
                { value: "Prof", label: "Prof." },
              ]}
            />
            <Name label="Name" />
            <Email label="Email" />
            <Web label="Url" />
            <Age label="Age" />
            <Accept label="Accept privacy policy" />
          </>
        )}
      </FormRenderer>
    </div>
  );
};
