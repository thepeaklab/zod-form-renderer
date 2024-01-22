import { z } from "zod";
import { FormRenderer } from "./form-renderer";

export const App = () => {
  const schema = z.object({
    title: z.enum(["Mr", "Mrs", "Miss", "Dr", "Prof"]),
    name: z.string(),
    email: z.string().email(),
    web: z.string().url().optional().nullable(),
    age: z.number(),
    // // Infering custom types is not possible, because they are of type ZodAny.
    // avatar: z.custom<File>().refine((file) => file.type.startsWith("image/")),
    avatar: z.string().refine((s) => s.endsWith(".png")),
    accept: z.boolean(),
  });

  const schemaWithEffects = schema.refine((data) => {
    return data.age > 18;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "2rem" }}>
      <FormRenderer schema={schemaWithEffects}>
        {({ Title, Name, Email, Web, Age, Avatar, Accept }) => (
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
            <Avatar label="Avatar" />
            <Accept label="Accept privacy policy" />
          </>
        )}
      </FormRenderer>
    </div>
  );
};
