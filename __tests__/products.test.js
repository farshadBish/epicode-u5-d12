// By default jest doesn't work with the new import syntax
// We should add NODE_OPTIONS=--experimental-vm-modules to the test script to fix that
import supertest from "supertest"
import dotenv from "dotenv"
import mongoose from "mongoose"
import server from "../src/server.js"
import ProductsModel from "../src/api/products/model.js"

dotenv.config() // This command forces .env variables to be loaded into process.env. This is the way to go when you can't use -r dotenv/config

const client = supertest(server) // Supertest is capable of running server.listen and it gives us back a client to be used to run http req against that server

const validProduct = {
  name: "test",
  description: "bla bla bla",
  price: 20,
}

const notValidProduct = {
  name: "test",
  description: "bla bla bla",
}

let newProduct

beforeAll(async () => {
  // beforeAll hook could be used to connect to Mongo and also to do some initial setup (like inserting mock data into the db)
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING)
  newProduct = new ProductsModel(validProduct)
  await newProduct.save()
})

afterAll(async () => {
  // afterAll hook could be used to close the connection with Mongo properly and to clean up db/collections
  await ProductsModel.deleteMany()
  await mongoose.connection.close()
})

describe("test api", () => {
  test("should check that mongo env var is set correctly", () => {
    expect(process.env.MONGO_CONNECTION_STRING).toBeDefined()
  })

  test("Should test that GET /products returns a success status code and a body", async () => {
    const response = await client.get("/products").expect(200)
    console.log(response.body)
  })

  test("Should test that POST /products returns a valid _id and 201", async () => {
    const response = await client
      .post("/products")
      .send(validProduct)
      .expect(201)
    expect(response.body._id).toBeDefined()
    console.log(response.body)
  })

  test("Should test that POST /products returns 400 in case of not valid product", async () => {
    await client.post("/products").send(notValidProduct).expect(400)
  })

  test("should test that GET /products/test endpoint returns a success status code", async () => {
    const response = await client.get("/products/test").expect(200)
    expect(response.body.message).toEqual("test")
  })

  test("Should test that GET /products/:id endpoint returns the correct product with a valid id", async() => {
    const response = await client.get(`/products/${newProduct._id}`).expect(200)
    console.log(newProduct);
    expect(response.body.product._id).toEqual(newProduct._id.toString())
  })

  test("Should test that GET /products/:id endpoint returns 404 product with a unvalid id", async() => {
    const response = await client.get(`/products/123456789101112131415161`).expect(404)
  })

  test("Should test that DELETE /products/:id endpoint returns 204 response code", async() => {
    const response = await client.delete(`/products/${newProduct._id}`).expect(204)
  })

  test("Should test that DELETE /products/:id endpoint returns 404 with a unvalid id", async() => {
    const response = await client.delete(`/products/123456789101112131415161`).expect(404)
  })
})

