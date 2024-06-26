# hatchedExpress.model

> [!CAUTION]
> This feature is deprecated. Do not use it. Use `hatchedExpress.orm.models` instead.

`hatchedExpress.model` is a collection of methods to create, retrieve, update and delete records using the underlying [ORM](https://sequelize.org/). These methods
are grouped by Schema name.

For example, the following shows using `Todo.findAll` to retrieve todo records as JavaScript objects:

```ts
import { hatchifyExpress } from "@hatchifyjs/express";

const schemas = {
  Todo: { ... },
  User: { ... },
} satisfies Record<string, PartialSchema>

const hatchedExpress = hatchifyExpress(schemas, {
  prefix: "/api",
  database: { uri: "sqlite://localhost/:memory" },
})

const deserializedTodos = await hatchedExpress.model.Todo.findAll({
  where: { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673" },
})
// deserializedTodos = [
//   { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }
// ]
```

Each model has the following methods:

- [findAll](#findall)
- [findAndCountAll](#findandcountall)
- [findOne](#findone)
- [create](#create)
- [update](#update)
- [destroy](#destroy)

## findAll

A method that retrieves Sequelize objects from the underlying ORM and database.

`hatchedExpress.model[schemaName].findAll(options : FindOptions) => Promise<[Model]>`

```ts
const deserializedTodos = await hatchedExpress.model.Todo.findAll({
  where: { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673" },
})
// deserializedTodos = [
//   { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }
// ]
```

**Parameters**

| Property | Type                                                                                       | Default | Details                       |
| -------- | ------------------------------------------------------------------------------------------ | ------- | ----------------------------- |
| options  | [FindOptions](https://sequelize.org/api/v6/class/src/model.js~model#static-method-findAll) | `{}`    | Specify what records to load. |

**Returns**

[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)\<Model> | [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null)>

**Rejects**

Since this is exposing the actual Sequelize function, it can throw any [Sequelize error](https://sequelize.org/api/v6/class/src/errors/base-error.ts~baseerror).

## findAndCountAll

Finds all the rows matching your query, within a specified offset / limit, and get the total number of rows matching your query. This is very useful for pagination.

`hatchedExpress.model[schemaName].findAndCountAll(options : FindOptions) => Promise<{ count: number, rows: Model[] }>`

```ts
const deserializedTodos = await hatchedExpress.model.Todo.findAll({
  where: { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673" },
  limit: 1,
  offset: 0,
})
// deserializedTodos = {
//   count: 10,
//   rows: [
//     { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }
//   ]
// }
```

**Parameters**

| Property | Type                                                                                       | Default | Details                       |
| -------- | ------------------------------------------------------------------------------------------ | ------- | ----------------------------- |
| options  | [FindOptions](https://sequelize.org/api/v6/class/src/model.js~model#static-method-findAll) | `{}`    | Specify what records to load. |

**Returns**

[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<{ count: [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), rows: [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)\<Model>}> | [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null)>

**Rejects**

Since this is exposing the actual Sequelize function, it can throw any [Sequelize error](https://sequelize.org/api/v6/class/src/errors/base-error.ts~baseerror).

## findOne

searches for a single instance. Returns the first instance found, or null if none can be found.

`hatchedExpress.model[schemaName].findAll(options: FindOptions) => Promise<Model | null>`

```ts
const deserializedTodo = await hatchedExpress.model.Todo.findOne({
  where: { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673" },
})
// deserializedTodo = { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }
```

**Parameters**

| Property | Type                                                                                       | Default | Details                       |
| -------- | ------------------------------------------------------------------------------------------ | ------- | ----------------------------- |
| options  | [FindOptions](https://sequelize.org/api/v6/class/src/model.js~model#static-method-findAll) | `{}`    | Specify what records to load. |

**Returns**

[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<Model | [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null)>

**Rejects**

Since this is exposing the actual Sequelize function, it can throw any [Sequelize error](https://sequelize.org/api/v6/class/src/errors/base-error.ts~baseerror).

## create

creates a new instance.

`hatchedExpress.model[schemaName].create(body: object, options: CreateOptions) => Promise<Model>`

```ts
const deserializedTodo = await hatchedExpress.model.Todo.create({ name: "Baking" })
// deserializedTodo = { name: "Baking" }
```

**Parameters**

| Property | Type                                                                                        | Default | Details                        |
| :------- | :------------------------------------------------------------------------------------------ | :------ | :----------------------------- |
| body     | object                                                                                      | N/A     | The data for the new instance. |
| options  | [CreateOptions](https://sequelize.org/api/v6/class/src/model.js~model#static-method-create) | `{}`    | Options for the creation.      |

**Returns**

[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<Model>

**Rejects**

Since this is exposing the actual Sequelize function, it can throw any [Sequelize error](https://sequelize.org/api/v6/class/src/errors/base-error.ts~baseerror).

## update

updates one or more instances.

`hatchedExpress.model[schemaName].update(body: object, options: UpdateOptions) => Promise<[number, Model[]]>`

```ts
const [updatedCount, updatedTodos] = await hatchedExpress.model.Todo.update({ name: "Serving" }, { where: { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673" } })
// updatedCount = 1
// updatedTodos = [{ name: "Serving" }]
```

**Parameters**

| Property | Type                                                                                        | Default | Details                 |
| :------- | :------------------------------------------------------------------------------------------ | :------ | :---------------------- |
| values   | object                                                                                      | N/A     | The values to update.   |
| options  | [UpdateOptions](https://sequelize.org/api/v6/class/src/model.js~model#static-method-update) | `{}`    | Options for the update. |

**Returns**

[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), Model[]]>

The promise returns an array with one or two elements. The first element is always the number of affected rows, while the second element is the actual affected rows (only supported in postgres with options.returning true).

**Rejects**

Since this is exposing the actual Sequelize function, it can throw any [Sequelize error](https://sequelize.org/api/v6/class/src/errors/base-error.ts~baseerror).

## destroy

Deletes one or more instances.

`hatchedExpress.model[schemaName].destroy(options: DestroyOptions, id?: Identifier) => Promise<number>`

```ts
const deletedCount = await hatchedExpress.model.Todo.destroy({
  where: { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673" },
})
// deletedCount = 1
```

**Parameters**

| Property | Type                                                                                          | Default | Details                  |
| :------- | :-------------------------------------------------------------------------------------------- | :------ | :----------------------- |
| options  | [DestroyOptions](https://sequelize.org/api/v6/class/src/model.js~model#static-method-destroy) | `{}`    | Options for the destroy. |

**Returns**

[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>

The promise returns the number of destroyed rows.

**Rejects**

Since this is exposing the actual Sequelize function, it can throw any [Sequelize error](https://sequelize.org/api/v6/class/src/errors/base-error.ts~baseerror).
