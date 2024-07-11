import {
  FormRenderer,
  createRendererMap,
  useFieldRendererContext,
} from '@src/index';
import { CheckboxRenderer } from '@test/support/renderers/renderer-checkbox';
import { DatepickerRenderer } from '@test/support/renderers/renderer-datepicker';
import { DefaultRenderer } from '@test/support/renderers/renderer-default';
import { NumberRenderer } from '@test/support/renderers/renderer-number';
import { SelectRenderer } from '@test/support/renderers/renderer-select';
import { SubmitButton } from '@test/support/renderers/renderer-submit';
import { TextRenderer } from '@test/support/renderers/renderer-text';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

const rendererMap = createRendererMap({
  Enum: SelectRenderer,
  String: TextRenderer,
  Number: NumberRenderer,
  Boolean: CheckboxRenderer,
  Date: DatepickerRenderer,
  Default: DefaultRenderer,
  Submit: SubmitButton,
});

const AvatarRenderer = () => {
  const { name, form } = useFieldRendererContext();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <label htmlFor={name}>
          <input
            id={name}
            type="file"
            onBlur={field.onBlur}
            onChange={(e) => field.onChange(e.target.files?.[0])}
          />
        </label>
      )}
    />
  );
};

const schema = z.object({
  title: z.enum(['', 'Dr.', 'Prof.']).optional(),
  name: z.string().min(3).max(30),
  birthday: z.coerce.date().max(new Date()).nullable(),
  age: z.number().min(18).nullable(),
  avatar: z
    .custom<File>()
    .optional()
    .refine((file) => file?.type?.endsWith('png')),
  accept: z.boolean().refine((b) => b === true),
});

const schemaWithEffects = schema.refine((data) => {
  return data.birthday !== null || data.age !== null;
});

export const App = () => {
  return (
    <FormRenderer
      schema={schemaWithEffects}
      typeRendererMap={rendererMap}
      fieldRendererMap={{
        avatar: AvatarRenderer,
      }}
      useFormProps={{
        mode: 'onBlur',
      }}
      onSubmit={(data, form) => {
        console.log(data);
        form.reset();
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'sans-serif',
        rowGap: '2rem',
      }}
    >
      {({ controls: { Title, Name, Birthday, Age, Avatar, Accept } }) => (
        <>
          <Title
            label="Title"
            options={[
              { value: '', label: 'None' },
              { value: 'Dr.', label: 'Dr.' },
              { value: 'Prof.', label: 'Prof.' },
            ]}
          />
          <Name label="Name" />
          <Birthday label="Birthday" />
          <Age label="Age" />

          {/* Inserting custom fields is always possible. */}
          <Avatar />

          <Accept label="Accept privacy policy" />

          {/* <Submit>Submit</Submit> */}
        </>
      )}
    </FormRenderer>
  );
};
