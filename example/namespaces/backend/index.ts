import { dirname } from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import Express from "express"
import { hatchifyExpress } from "@hatchifyjs/express"
import * as Schemas from "../schemas.js"

dotenv.config()

const currentDir = dirname(fileURLToPath(import.meta.url))

const app = Express()
const hatchedExpress = hatchifyExpress(Schemas, {
  prefix: "/api",
  database: {
    uri: process.env.DB_URI,
  },
})

;(async () => {
  await hatchedExpress.modelSync({ alter: true })

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite")

    const vite = await createViteServer({
      root: `${currentDir}/../`,
      server: { middlewareMode: true },
    })

    app.use((req, res, next) => {
      if (req.url.startsWith("/api")) {
        next()
      } else {
        vite.middlewares.handle(req, res, next)
      }
    })
  }

  app.use(hatchedExpress.middleware.allModels.all)

  app.listen(5175, () => {
    console.log("Started on http://localhost:5175")
  })
})()
