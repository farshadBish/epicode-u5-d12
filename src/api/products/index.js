import express from "express"
import createError from "http-errors"
import ProductsModel from "./model.js"

const productsRouter = express.Router()

productsRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new ProductsModel(req.body) // here mongoose validation happens
    const { _id } = await newUser.save() // here the validated record is saved
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/test", async (req, res, next) => {
  res.send({ message: "test" })
})

productsRouter.get("/", async (req, res, next) => {
  try {
    const users = await ProductsModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await ProductsModel.findById(req.params.userId)
    if (user) {
      res.send({ currentRequestingUser: req.user, user })
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:userId", async (req, res, next) => {
  try {
    const updatedUser = await ProductsModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    )
    if (updatedUser) {
      res.send(updatedUser)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.delete("/:userId", async (req, res, next) => {
  try {
    const deletedUser = await ProductsModel.findByIdAndDelete(req.params.userId)
    if (deletedUser) {
      res.status(204).send()
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default productsRouter
