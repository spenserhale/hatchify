import type { PartialEnumControlType, PartialEnumProps } from "./types"
import { validateValues } from "./validateValues"
import { HatchifyInvalidInputError } from "../../types"

export function getPartialControl(
  props: PartialEnumProps,
): PartialEnumControlType {
  if (!validateValues(props.values)) {
    throw new HatchifyInvalidInputError(
      "enum must be called with values as a non-empty string array",
    )
  }

  return {
    type: "String",
    allowNull: props?.required == null ? props?.required : !props.required,
    primary: props?.primary,
    values: props.values,
  }
}