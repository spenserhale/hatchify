# Empty

API Reference docs for the Hatchify Empty component. Learn more about props.

The `Empty` is used to customize what is displayed when the Hatchify `DataGrid` has no records to display.

## Import

```tsx
import { hatchifyReact, createJsonapiClient } from "@hatchifyjs/react"
import * as Schemas from "../schemas.js"

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const { Empty: TodoEmpty } = hatchedReact.components.Todo
const { Empty: UserEmpty } = hatchedReact.components.User
// or
const UserEmpty = hatchedReact.components.User.Empty
const TodoEmpty = hatchedReact.components.Todo.Empty
```

## Props

| Prop Name | Type                    | Default | Description                                                                                                       |
| --------- | ----------------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| children  | React.ReactNode or Null | -       | What to display for an emptyList, can be as simple as a string or more advanced such as a custom stylized element |

### Example

```tsx
//in App.tsx
const TodoEmpty = hatchedReact.components.Todo.Empty // 👀

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoDataGrid>
          <TodoEmpty>No records to display</TodoEmpty> {/* 👀 */}
        </TodoDataGrid>
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```