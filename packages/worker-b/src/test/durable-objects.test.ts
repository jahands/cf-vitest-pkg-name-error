import { env, runInDurableObject } from "cloudflare:test"
import { expect, test } from "vitest"
import { MyDurableObject } from ".."

test("do stuff", async () => {
  const id = env.MY_DURABLE_OBJECT.idFromName(crypto.randomUUID())
  const stub = env.MY_DURABLE_OBJECT.get(id)
  await runInDurableObject(stub, async (instance) => {
    expect(instance).instanceOf(MyDurableObject)
  })
})
