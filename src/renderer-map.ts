import { RendererMap } from "./lib/form-renderer";
import {
  CheckboxRenderer,
  CheckboxRendererProps,
} from "./renderers/checkbox-renderer";
import {
  DatepickerRenderer,
  DatepickerRendererProps,
} from "./renderers/datepicker-renderer";
import { InputRenderer, InputRendererProps } from "./renderers/input-renderer";
import { NullRenderer } from "./renderers/null-renderer";
import {
  SelectRenderer,
  SelectRendererProps,
} from "./renderers/select-renderer";
import { SubmitButton, SubmitButtonProps } from "./renderers/submit-renderer";

// The user has to provide a renderer map with prop types
// to allow IntelliSense type inference.
export const fieldRenderers: RendererMap<
  SelectRendererProps,
  InputRendererProps,
  InputRendererProps,
  CheckboxRendererProps,
  DatepickerRendererProps,
  SubmitButtonProps
> = {
  Enum: SelectRenderer,
  String: InputRenderer,
  Number: InputRenderer,
  Boolean: CheckboxRenderer,
  Date: DatepickerRenderer,
  Default: NullRenderer,
  Submit: SubmitButton,
};
