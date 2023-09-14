import { finalize } from "./finalize"
import { integer, string } from "../../dataTypes"
import { HatchifyInvalidSchemaError } from "../../types"
import type { SemiFinalSchema } from "../../types"

describe("finalize", () => {
  const schemas: Record<string, SemiFinalSchema> = {
    Todo: {
      name: "Todo",
      id: integer({ required: true, autoIncrement: true }).finalize(),
      attributes: {
        importance: integer({ min: 0 }).finalize(),
      },
    },
    User: {
      name: "User",
      id: integer({ required: true, autoIncrement: true }).finalize(),
      attributes: {
        name: string().finalize(),
      },
    },
  }

  it("populates targetSchema and targetAttribute", () => {
    const { User } = finalize(
      "User",
      { type: "hasOne", targetSchema: null, targetAttribute: null },
      "todo",
      schemas,
    )

    expect(User.relationships?.todo).toEqual({
      type: "hasOne",
      targetSchema: "Todo",
      targetAttribute: "userId",
    })
  })

  it("keeps provided targetSchema and targetAttribute", () => {
    const { Todo, User } = finalize(
      "User",
      {
        type: "hasOne",
        targetSchema: "Todo",
        targetAttribute: "assigneeId",
      },
      "todo",
      schemas,
    )

    expect(Todo.attributes.assigneeId).toBeDefined()

    expect(User.relationships?.todo).toEqual({
      type: "hasOne",
      targetSchema: "Todo",
      targetAttribute: "assigneeId",
    })
  })

  it("handles circular relationships", () => {
    const { User } = finalize(
      "User",
      {
        type: "hasOne",
        targetSchema: "User",
        targetAttribute: "managerId",
      },
      "manager",
      schemas,
    )

    expect(User.attributes.managerId).toBeDefined()

    expect(User.relationships?.manager).toEqual({
      type: "hasOne",
      targetSchema: "User",
      targetAttribute: "managerId",
    })
  })

  it("handles non-existing targetSchema", () => {
    expect(() =>
      finalize(
        "User",
        {
          type: "hasOne",
          targetSchema: "Invalid",
          targetAttribute: null,
        },
        "todo",
        schemas,
      ),
    ).toThrow(new HatchifyInvalidSchemaError("Schema 'Invalid' is undefined"))
  })
})