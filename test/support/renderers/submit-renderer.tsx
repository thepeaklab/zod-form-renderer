import { ComponentPropsWithRef } from "react";

export type SubmitButtonProps = ComponentPropsWithRef<"button">;

export const SubmitButton = (props: SubmitButtonProps) => {
  return <button type="submit" {...props} />;
};
