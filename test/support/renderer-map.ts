import { createRendererMap } from "../../src";
import { CheckboxRenderer } from "./renderers/checkbox-renderer";
import { DatepickerRenderer } from "./renderers/datepicker-renderer";
import { NullRenderer } from "./renderers/null-renderer";
import { NumberRenderer } from "./renderers/number-renderer";
import { SelectRenderer } from "./renderers/select-renderer";
import { SubmitButton } from "./renderers/submit-renderer";
import { TextRenderer } from "./renderers/text-renderer";

export const rendererMap = createRendererMap({
  Enum: SelectRenderer,
  String: TextRenderer,
  Number: NumberRenderer,
  Boolean: CheckboxRenderer,
  Date: DatepickerRenderer,
  Default: NullRenderer,
  Submit: SubmitButton,
});
