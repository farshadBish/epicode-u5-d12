import express from "express"
import cors from "cors"
import usersRouter from "./api/users/index.js"
import productsRouter from "./api/products/index.js"
import {
  badRequestErrorHandler,
  forbiddenErrorHandler,
  genericErroHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js"

const server = express()

// ********************************* MIDDLEWARES *****************************
server.use(cors())
server.use(express.json())

// ********************************** ENDPOINTS ******************************
server.use("/users", usersRouter)
server.use("/products", productsRouter)
server.use("/test", (req, res, next) => {
  res.send({ hello: "world" })
})

// ******************************** ERROR HANDLERS ***************************
server.use(badRequestErrorHandler)
server.use(unauthorizedErrorHandler)
server.use(forbiddenErrorHandler)
server.use(notFoundErrorHandler)
server.use(genericErroHandler)

export default server
