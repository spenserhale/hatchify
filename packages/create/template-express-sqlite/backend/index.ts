import Express from "express"
import { createServer as createViteServer } from "vite"
import { hatchifyExpress } from "@hatchifyjs/express"
import * as Schemas from "../schemas"

const app = Express()
const hatchedExpress = hatchifyExpress(Schemas, {
  prefix: "/api",
  database: {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  },
})

;(async () => {
  await hatchedExpress.createDatabase()

  const vite = await createViteServer({
    root: `${__dirname}/../`,
    server: { middlewareMode: true },
  })

  app.use(hatchedExpress.middleware.allModels.all)
  app.use(vite.middlewares)

  app.listen(3000, () => {
    console.log("Started on port 3000")
  })
})()
