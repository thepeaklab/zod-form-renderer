import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ComplexForm } from "./support/forms/complex";
import { CustomForm, NonPrimitiveForm } from "./support/forms/custom";
import { PrimitivesForm } from "./support/forms/primitives";

describe("FormRenderer / useFormRenderer", () => {
  it("should render form fields for primitive types", () => {
    const { getByLabelText, getByText, getAllByRole } = render(
      <PrimitivesForm onSubmit={() => {}} />
    );

    expect(getByLabelText(/Title/)).toBeDefined();
    expect(getAllByRole("option").length).toBe(3);

    expect(getByLabelText(/Name/)).toBeDefined();
    expect(getByLabelText(/Name/)).toHaveProperty("type", "text");

    expect(getByLabelText(/Birthday/)).toBeDefined();
    expect(getByLabelText(/Birthday/)).toHaveProperty("type", "date");

    expect(getByLabelText(/Age/)).toBeDefined();
    expect(getByLabelText(/Age/)).toHaveProperty("type", "number");

    expect(getByLabelText(/Accept/)).toBeDefined();
    expect(getByLabelText(/Accept/)).toHaveProperty("type", "checkbox");

    expect(getByText(/Submit/)).toBeDefined();
  });

  it("should render form fields for schema with effects", () => {
    const { getByLabelText, getByText, getAllByRole } = render(
      <ComplexForm onSubmit={() => {}} />
    );

    expect(getByLabelText(/Title/)).toBeDefined();
    expect(getAllByRole("option").length).toBe(3);

    expect(getByLabelText(/Name/)).toBeDefined();
    expect(getByLabelText(/Name/)).toHaveProperty("type", "text");

    expect(getByLabelText(/Birthday/)).toBeDefined();
    expect(getByLabelText(/Birthday/)).toHaveProperty("type", "date");

    expect(getByLabelText(/Age/)).toBeDefined();
    expect(getByLabelText(/Age/)).toHaveProperty("type", "number");

    expect(getByLabelText(/Accept/)).toBeDefined();
    expect(getByLabelText(/Accept/)).toHaveProperty("type", "checkbox");

    expect(getByText(/Submit/)).toBeDefined();
  });

  it("should provide a default field for non-primitive types", () => {
    const { queryByLabelText, getByText } = render(
      <NonPrimitiveForm onSubmit={() => {}} />
    );

    expect(queryByLabelText(/ProfileImage/)).toBeNull();
    expect(getByText(/Submit/)).toBeDefined();
  });

  it("should apply useFormProps to the useForm hook", () => {
    const { getByLabelText } = render(<PrimitivesForm onSubmit={() => {}} />);

    expect(getByLabelText(/Name/)).toBeDefined();
    expect(getByLabelText(/Name/)).toHaveProperty("value", "John Doe");
  });

  it("should return errors when validated", async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByText } = render(
      <ComplexForm onSubmit={() => {}} />
    );

    const nameField = getByLabelText(/Name/);
    expect(nameField).toBeDefined();

    await user.type(nameField, "JC");
    expect(nameField).toHaveProperty("value", "JC");

    await user.click(getByText(/Submit/));
    expect(screen.getByText(/at least 3 character/)).toBeDefined();
  });

  it("should run onSubmit when the form is submitted", async () => {
    const user = userEvent.setup();

    const mockSubmit = vi.fn((values) => {
      return Promise.resolve(values);
    });

    const { getByLabelText, getByText } = render(
      <PrimitivesForm onSubmit={mockSubmit} />
    );

    await user.selectOptions(getByLabelText(/Title/), "Dr.");
    expect(getByLabelText(/Title/)).toHaveProperty("value", "Dr.");

    await user.clear(getByLabelText(/Name/));
    await user.type(getByLabelText(/Name/), "Jane Doe");
    expect(getByLabelText(/Name/)).toHaveProperty("value", "Jane Doe");

    // Date input fields have no value property.
    await user.type(getByLabelText(/Birthday/), "2024-01-18");

    await user.type(getByLabelText(/Age/), "42");
    expect(getByLabelText(/Age/)).toHaveProperty("value", "42");

    await user.click(getByLabelText(/Accept/));
    expect(getByLabelText(/Accept/)).toHaveProperty("checked", true);

    await user.click(getByText(/Submit/));

    expect(mockSubmit).toHaveResolvedWith({
      title: "Dr.",
      name: "Jane Doe",
      birthday: new Date("2024-01-18"),
      age: 42,
      accept: true,
    });
  });

  it("should integrate with custom controls", async () => {
    const user = userEvent.setup();

    const mockSubmit = vi.fn((values) => {
      return Promise.resolve(values);
    });

    const { getByLabelText, getByText } = render(
      <CustomForm onSubmit={mockSubmit} />
    );

    const file = new File([""], "image.png", { type: "image/png" });
    await user.upload(getByLabelText(/Profile Image/), file);

    await user.click(getByText(/Submit/));

    expect(mockSubmit).toHaveResolvedWith({
      profileImage: file,
    });
  });
});
