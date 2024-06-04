<p align="center">
  <img width="300px" src="./logo.png" style="max-width:100%;">
</p>

# Zod Form Renderer

Auto-infer form fields from [zod](https://zod.dev/) schema.

## Installation

```sh
npm install -S zod-form-renderer
```

## Documentation

The zod form renderer uses the zod type inference to map schema properties to form input fields.

This library might be useful to you, if you

- [ ] use zod and react-hook-form
- [ ] know your zod schema at build time
- [ ] have multiple forms in your application
- [ ] want a clean forms API without any `formik` or `react-hook-form` clutter.

### Creating a zod schema

Start by creating your zod validation schema.

```ts
export const mySchema = z.object({
  title: z.enum(["", "Dr.", "Prof."]),
  name: z.string(),
  birthday: z.coerce.date(),
  age: z.number(),
  accept: z.boolean(),
});
```

As you can see, a schema may contain different zod types. We will use these to create separate field renderers.

### Creating a field renderer

To give you an example, we use a simple `TextInputRenderer` for zod strings.

```tsx
import { ComponentPropsWithRef } from "react";
import { useFieldRendererContext } from "zod-form-renderer";

// Use input props as for any React component
export type TextRendererProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

export const TextRenderer = (props: TextRendererProps) => {
  // The zod-form-renderer will automatically provide the field
  // name, schema and form context to use in the renderer.
  const { name, schema, form } = useFieldRendererContext();

  // React to errors in the field state
  const error = form.formState.errors?.[name];

  return (
    <div>
      <label htmlFor={name}>
        {props.label}
        {schema.isOptional() && ` (Optional)`}
      </label>
      <br />

      <input id={name} {...form.register(name)} {...props} />
      <br />
      <p style={{ color: "red" }}>{error?.message?.toString()}</p>
    </div>
  );
};
```

A field renderer is a simple React component which displays an input field. You can apply any styling or additional behavior.
Use `type="number"` for `z.number()` types or `<select />` for `z.enum()`. Further examples can be found in `/test/support/renderers`.

### Setting up a type renderer map

Once you have defined field renderers for all zod primitive types, combine them in a map.

```ts
import { createRendererMap } from "zod-form-renderer";

// Provide renderers for all these required types
export const myRendererMap = createRendererMap({
  Enum: SelectRenderer,
  String: TextRenderer,
  Number: NumberRenderer,
  Boolean: CheckboxRenderer,
  Date: DatepickerRenderer,
  Default: DefaultRenderer,
  Submit: SubmitButton,
});
```

### Setting up a FormRenderer instance

Now you're ready to set up your first form renderer instance.

```tsx
import { FormRenderer } from "zod-form-renderer";

<FormRenderer
  schema={mySchema}
  typeRendererMap={myRendererMap}
  useFormProps={{
    // Under the hood, react-hook-form is used.
    // Apply any form behavior you'd like
    defaultValues: {
      name: "John Doe",
    },
  }}
  onSubmit={(values) => {
    console.log(values);
  }}
>
  {({ controls: { Title, Name, Birthday, Age, Accept, Submit } }) => (
    <>
      <Title
        label="My Title"
        options={[
          { value: "", label: "None" },
          { value: "Dr.", label: "Dr." },
          { value: "Prof.", label: "Prof." },
        ]}
      />
      <Name label="My Name" />
      <Birthday label="My Birthday" />
      <Age label="My Age" />
      <Accept label="I Accept" />
      <Submit>Let's go!</Submit>
    </>
  )}
</FormRenderer>;
```

The form renderer returns a `controls` property with React components. These components are directly and type-safely inferred from your `schema` and `rendererMap`.
Any required properties from your field renderers will be enforced. No wiring-up or registering is required for `react-hook-form`, you simply add your submit handler and that's it!

### Using react-hook-form options

As seen before, any `react-hook-form` configuration will be passed through.
The `<FormRenderer />` also returns a reference to the hook-form, so you have access to all instance methods there.

```tsx
<FormRenderer /** props... **/>
  {({
    controls: {
      /** ... **/
    },
    form,
  }) => {
    const hasAccepted = form.watch("accept");

    return (
      <>
        {/** Other form fields **/}

        <Accept label="I Accept" />
        <Submit disabled={!hasAccepted}>Let's go!</Submit>
      </>
    );
  }}
</FormRenderer>
```

### Overwriting default form fields

You might ask yourself, what about custom fields like a file upload? Or you want both a select box and a radio button group for your `z.enum()` type within the same form?

No worries, we got you covered. Overwriting single fields is possible with the optional `fieldRendererMap` property.

```tsx
// Define a FileUploadRenderer with <input type="file">.
import { FileUploadRenderer, FileUploadRendererProps } from '...';

<FormRenderer
  schema={...}
  typeRendererMap={myRendererMap}
  fieldRendererMap={{
    myImage: FileUploadRenderer,
  }}
  onSubmit={...}
>
  {({ controls: { MyImage, Submit } }) => (
    <>
      <MyImage<FileUploadRendererProps> />
      <Submit>Upload</Submit>
    </>
  )}
</FormRenderer>
```

Overwriting any form field is always possible. You can create as many renderers as you like and apply them where needed.
Please note that you have to provide the props type manually as a generic in this case. We are not able to infer that yet.

## Contributing

### Code of Conduct

Please read our [Code of conduct](./CODE_OF_CONDUCT) to keep our community open and respectable. 💖

### Want to help?

Want to report a bug, contribute some code, or improve the documentation? Excellent!
Read up on our [guidelines for contributing](./CONTRIBUTING.md) and then check out one of our issues labeled as `help wanted` or `good first issue`.

### Security

If you believe you have found a security vulnerability, we encourage you to responsibly disclose this and not open a public issue.
Security issues in this open source project can be safely reported via <opensource@thepeaklab.com>.

### License

This project is MIT-licensed.

---

Developed with 💖 at the peak lab.
