import { buildValidation } from "./buildValidation"
import type { FinalNumberORM, PartialNumberORM } from "./types"

export function finalizeOrm(props: PartialNumberORM): FinalNumberORM {
  const { validate, ...sequelize } = props.sequelize

  return {
    sequelize: {
      ...sequelize,
      typeArgs: [],
      allowNull: sequelize.allowNull !== false && !sequelize.primaryKey,
      autoIncrement: !!sequelize.autoIncrement,
      primaryKey: !!sequelize.primaryKey,
      ...buildValidation(validate.min, validate.max),
    },
  }
}