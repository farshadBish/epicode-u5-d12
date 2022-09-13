// By default jest doesn't work with the new import syntax
// We should add NODE_OPTIONS=--experimental-vm-modules to the test script to fix that
import supertest from "supertest"

describe("test api", () => {
  test("Should test that true is true", () => {
    expect(true).toBe(true)
  })
})
