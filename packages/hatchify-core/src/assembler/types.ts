import type {
  FinalDatetimeORM,
  PartialDatetimeControlType,
  PartialDatetimeORM,
} from "../dataTypes/datetime"
import type {
  FinalEnumORM,
  PartialEnumControlType,
  PartialEnumORM,
} from "../dataTypes/enumerate/types"
import type {
  FinalNumberORM,
  PartialNumberControlType,
  PartialNumberORM,
} from "../dataTypes/number"
import type {
  FinalStringORM,
  PartialStringControlType,
  PartialStringORM,
} from "../dataTypes/string"
import type { FinalAttribute, PartialAttribute } from "../types"

export interface PartialSchema {
  name: string
  id?: PartialAttribute<
    PartialNumberORM,
    PartialNumberControlType,
    number,
    FinalNumberORM
  >
  attributes: {
    [attributeName: string]:
      | PartialAttribute<
          PartialNumberORM,
          PartialNumberControlType,
          number,
          FinalNumberORM
        >
      | PartialAttribute<
          PartialStringORM,
          PartialStringControlType,
          string,
          FinalStringORM
        >
      | PartialAttribute<
          PartialDatetimeORM,
          PartialDatetimeControlType,
          Date,
          FinalDatetimeORM
        >
      | PartialAttribute<
          PartialEnumORM,
          PartialEnumControlType,
          string,
          FinalEnumORM
        >
  }
}
export interface FinalSchema {
  name: string
  id: FinalAttribute<
    PartialNumberORM,
    PartialNumberControlType,
    number,
    FinalNumberORM
  >
  attributes: {
    [attributeName: string]:
      | FinalAttribute<
          PartialNumberORM,
          PartialNumberControlType,
          number,
          FinalNumberORM
        >
      | FinalAttribute<
          PartialStringORM,
          PartialStringControlType,
          string,
          FinalStringORM
        >
      | FinalAttribute<
          PartialDatetimeORM,
          PartialDatetimeControlType,
          Date,
          FinalDatetimeORM
        >
      | FinalAttribute<
          PartialEnumORM,
          PartialEnumControlType,
          string,
          FinalEnumORM
        >
  }
}

export type PartialSchemaWithPrimaryAttribute = Omit<PartialSchema, "id"> & {
  id: PartialAttribute<
    PartialNumberORM,
    PartialNumberControlType,
    number,
    FinalNumberORM
  >
}
