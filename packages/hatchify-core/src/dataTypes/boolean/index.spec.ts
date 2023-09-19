import { HatchifyCoerceError } from "../../types"

import { boolean } from "."

describe("boolean", () => {
  describe("boolean()", () => {
    const type = boolean()

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: "boolean()",
        orm: {
          sequelize: {
            type: "BOOLEAN",
            allowNull: undefined,
          },
        },
        control: {
          type: "Boolean",
          allowNull: undefined,
        },
        finalize: expect.any(Function),
      })
    })

    it("transforms correctly", () => {
      const {
        serializeORMPropertyValue,
        setORMPropertyValue,
        setORMQueryFilterValue,
      } = type.finalize()

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(true)).toBe(true)
      expect(serializeORMPropertyValue(false)).toBe(false)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as boolean),
      ).toThrow(new HatchifyCoerceError("as a boolean"))

      // setORMPropertyValue
      expect(setORMPropertyValue(true)).toBe(true)
      expect(setORMPropertyValue(false)).toBe(false)
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() =>
        setORMPropertyValue("invalid" as unknown as boolean),
      ).toThrow(new HatchifyCoerceError("as a boolean"))

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("true")).toBe(true)
      expect(setORMQueryFilterValue("false")).toBe(false)
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as a boolean"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: "boolean()",
        orm: {
          sequelize: {
            type: "BOOLEAN",
            allowNull: true,
          },
        },
        control: {
          type: "Boolean",
          allowNull: true,
        },
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })

  describe("boolean({required: true})", () => {
    const type = boolean({ required: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'boolean({"required":true})',
        orm: {
          sequelize: {
            type: "BOOLEAN",
            allowNull: false,
          },
        },
        control: {
          type: "Boolean",
          allowNull: false,
        },
        finalize: expect.any(Function),
      })
    })

    it("transforms correctly", () => {
      const {
        serializeORMPropertyValue,
        setORMPropertyValue,
        setORMQueryFilterValue,
      } = type.finalize()

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(true)).toBe(true)
      expect(serializeORMPropertyValue(false)).toBe(false)
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as boolean),
      ).toThrow(new HatchifyCoerceError("as a boolean"))

      // setORMPropertyValue
      expect(setORMPropertyValue(true)).toBe(true)
      expect(setORMPropertyValue(false)).toBe(false)
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() =>
        setORMPropertyValue("invalid" as unknown as boolean),
      ).toThrow(new HatchifyCoerceError("as a boolean"))

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("true")).toBe(true)
      expect(setORMQueryFilterValue("false")).toBe(false)
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as a boolean"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'boolean({"required":true})',
        orm: {
          sequelize: {
            type: "BOOLEAN",
            allowNull: false,
          },
        },
        control: {
          type: "Boolean",
          allowNull: false,
        },
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })
})