import { z } from "zod";
import { renderForm } from "./form-renderer";

export const App = () => {
  const schema = z.object({
    title: z.enum(["Mr", "Mrs", "Miss", "Dr", "Prof"]),
    name: z.string(),
    email: z.string().email(),
    web: z.string().url(),
    age: z.number(),
    birthDate: z.date(),
    avatar: z.custom<File>().refine((file) => file.type.startsWith("image/")),
    accept: z.boolean(),
  });

  const schemaWithEffects = schema.refine((data) => {
    return data.age > 18;
  });

  const { controls } = renderForm(schemaWithEffects);

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "2rem" }}>
      <b>Hello zod-form-renderer</b>

      {/*
        DX verbessern:
        Return React components statt functions. Params incl. overwrite, file.
      */}
      {controls.title({
        label: "Title",
        options: [
          { value: "Mr", label: "Mr." },
          { value: "Mrs", label: "Mrs." },
          { value: "Miss", label: "Miss." },
          { value: "Dr", label: "Dr." },
          { value: "Prof", label: "Prof." },
        ],
      })}
      {controls.name({ label: "Name" })}
      {controls.email({ label: "Email" })}
      {controls.age({ label: "Age" })}
      {controls.accept({ label: "Accept privacy policy" })}
    </div>
  );
};
