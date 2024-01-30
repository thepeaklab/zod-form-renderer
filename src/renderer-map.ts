import { RendererMap } from "./lib/form-renderer";
import {
  CheckboxRenderer,
  CheckboxRendererProps,
} from "./renderers/checkbox-renderer";
import { InputRenderer, InputRendererProps } from "./renderers/input-renderer";
import { NullRenderer } from "./renderers/null-renderer";
import {
  SelectRenderer,
  SelectRendererProps,
} from "./renderers/select-renderer";

// The user has to provide a renderer map with prop types
// to allow IntelliSense type inference.
export const fieldRenderers: RendererMap<
  SelectRendererProps,
  InputRendererProps,
  InputRendererProps,
  CheckboxRendererProps
> = {
  Enum: SelectRenderer,
  String: InputRenderer,
  Number: InputRenderer,
  Boolean: CheckboxRenderer,
  Default: NullRenderer,
};
