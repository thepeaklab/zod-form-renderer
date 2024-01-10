import { z } from "zod";
import { renderForm } from "./form-renderer";

// const example = z.object({
//   title: z.enum(["Mr", "Mrs", "Miss", "Dr", "Prof"]),
//   name: z.string(),
//   email: z.string().email(),
//   web: z.string().url(),
//   count: z.number(),
//   birth: z.date(),
//   // file
//   // textarea
//   // radio
//   // checkbox
// });

export const App = () => {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    age: z.number(),
    accept: z.boolean(),
  });

  const { controls } = renderForm(schema);

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "2rem" }}>
      <b>Hello zod-form-renderer</b>

      {controls.name({ label: "Name Label" })}
      {controls.email({ label: "Email Label" })}
      {controls.age()}
      {controls.accept()}
    </div>
  );
};
