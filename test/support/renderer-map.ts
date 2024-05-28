import { createRendererMap } from "@src/renderer-map";
import { CheckboxRenderer } from "./renderers/renderer-checkbox";
import { DatepickerRenderer } from "./renderers/renderer-datepicker";
import { DefaultRenderer } from "./renderers/renderer-default";
import { NumberRenderer } from "./renderers/renderer-number";
import { SelectRenderer } from "./renderers/renderer-select";
import { SubmitButton } from "./renderers/renderer-submit";
import { TextRenderer } from "./renderers/renderer-text";

export const rendererMap = createRendererMap({
  Enum: SelectRenderer,
  String: TextRenderer,
  Number: NumberRenderer,
  Boolean: CheckboxRenderer,
  Date: DatepickerRenderer,
  Default: DefaultRenderer,
  Submit: SubmitButton,
});
