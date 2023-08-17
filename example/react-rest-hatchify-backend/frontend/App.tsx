import { useEffect, useState } from "react"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import createJsonapiClient from "@hatchifyjs/rest-client-jsonapi"
import { Todo } from "../schemas/todo"
import { User } from "../schemas/user"

export const hatchedReactRest = hatchifyReactRest(
  { Todo, User },
  createJsonapiClient("http://localhost:3000/api", {
    Todo: { endpoint: "todos" },
    User: { endpoint: "users" },
  }),
)

const App: React.FC = () => {
  return (
    <div>
      <Todos />
      <Users />
    </div>
  )
}

export default App

function Todos() {
  const [enableFilter, setEnableFilter] = useState(false)
  const [todos, todosState] = hatchedReactRest.Todo.useAll({
    include: ["user"],
    filter: enableFilter ? { name: ["Workout", "other"] } : undefined,
  })
  const [users, usersState] = hatchedReactRest.User.useAll()
  const [createTodo, createState] = hatchedReactRest.Todo.useCreateOne()
  const [deleteTodo, deleteState] = hatchedReactRest.Todo.useDeleteOne()
  const [todoName, setTodoName] = useState("")
  const [selectedUser, setSelectedUser] = useState("")

  if (todosState.isLoading) return <div>fetching todos...</div>
  if (todosState.isRejected) return <div>failed to fetch todos</div>

  return (
    <div>
      <h1>Todos</h1>
      <input
        type="text"
        value={todoName}
        onChange={(e) => setTodoName(e.target.value)}
      />
      <select
        disabled={usersState.isLoading}
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">select user</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <button
        disabled={createState.isLoading}
        type="button"
        onClick={() => {
          createTodo({
            type: "Todo",
            attributes: { name: todoName },
            relationships: selectedUser
              ? {
                  user: { data: { type: "User", id: selectedUser } },
                }
              : undefined,
          })
          setTodoName("")
          setSelectedUser("")
        }}
      >
        {createState.isLoading ? "creating..." : "create todo"}
      </button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>User</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.name}</td>
              <td>{todo.user?.name}</td>
              <td>
                <button
                  disabled={deleteState.isLoading}
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                >
                  delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={() => setEnableFilter(!enableFilter)}>
        {enableFilter ? "disable filter" : "filter [Workout, other]"}
      </button>
    </div>
  )
}

function Users() {
  const [users, usersState] = hatchedReactRest.User.useAll()
  const [createUser, createState] = hatchedReactRest.User.useCreateOne()
  const [deleteUser, deleteState] = hatchedReactRest.User.useDeleteOne()
  const [userName, setUserName] = useState("")
  const [userIdToEdit, setUserIdToEdit] = useState<string | null>(null)

  if (usersState.isLoading) return <div>fetching users...</div>
  if (usersState.isRejected) return <div>failed to fetch users</div>

  return (
    <div>
      <h1>Users</h1>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button
        disabled={createState.isLoading}
        type="button"
        onClick={() => {
          createUser({ type: "User", attributes: { name: userName } })
          setUserName("")
        }}
      >
        create user
      </button>
      {createState.error && <div>{createState?.error[0]?.detail}</div>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>
                <button
                  disabled={deleteState.isLoading}
                  type="button"
                  onClick={() => deleteUser(user.id)}
                >
                  delete
                </button>
              </td>
              <td>
                <button
                  disabled={deleteState.isLoading}
                  type="button"
                  onClick={() => setUserIdToEdit(user.id)}
                >
                  edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {userIdToEdit && (
          <EditUser id={userIdToEdit} setUserIdToEdit={setUserIdToEdit} />
        )}
      </div>
    </div>
  )
}

function EditUser({ id, setUserIdToEdit }: any) {
  const [updateUser, updateState] = hatchedReactRest.User.useUpdateOne()
  const [user, userState] = hatchedReactRest.User.useOne(id)
  const [name, setName] = useState("")

  useEffect(() => {
    if (user?.name) {
      setName(user.name)
    }
  }, [user?.name])

  if (userState.isLoading) return <div>fetching user...</div>
  if (!user || userState.isRejected) return <div>failed to fetch user</div>

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        disabled={updateState.isLoading}
        type="button"
        onClick={() => {
          updateUser({ id, type: "User", attributes: { name } })
          setUserIdToEdit(null)
        }}
      >
        submit
      </button>
    </div>
  )
}