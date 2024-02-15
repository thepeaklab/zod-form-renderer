import { createRendererMap } from "./lib/renderer-map";
import { CheckboxRenderer } from "./renderers/checkbox-renderer";
import { DatepickerRenderer } from "./renderers/datepicker-renderer";
import { InputRenderer } from "./renderers/input-renderer";
import { NullRenderer } from "./renderers/null-renderer";
import { SelectRenderer } from "./renderers/select-renderer";
import { SubmitButton } from "./renderers/submit-renderer";

export const fieldRenderers = createRendererMap({
  Enum: SelectRenderer,
  String: InputRenderer,
  Number: InputRenderer,
  Boolean: CheckboxRenderer,
  Date: DatepickerRenderer,
  Default: NullRenderer,
  Submit: SubmitButton,
});
