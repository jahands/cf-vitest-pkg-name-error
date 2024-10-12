# cf-vitest-pkg-name-error

This is a repro of an issue with `@cloudflare/vitest-pool-workers` when using the `runInDurableObject()` helper.

## Problem

When the `package.json` for the Worker contains a namespace, e.g. `@repo/worker-a`, `runInDurableObject()` throws an error. However, if the package does not, then it works fine.

## Repro

This repo has two identical workers:

- `packages/worker-a`
- `packages/worker-b`

The only difference is in the name within `package.json`:

- `packages/worker-a/package.json` contains `"name": "worker-a"`
- `packages/worker-b/package.json` contains `"name": "@repo/worker-b"`

First, install dependencies:

```sh
pnpm install
```

Next, run tests:

```sh
pnpm test
```

This results in the following output, showing that `worker-a` tests pass, but `@repo/worker-b` fails:

```
$ pnpm test

> cf-vitest-pkg-name-error@1.0.0 test /Users/jh/src/cf-vitest-pkg-name-error
> vitest run


 RUN  v2.1.1 /Users/jh/src/cf-vitest-pkg-name-error

[vpw:inf] Starting single runtime for packages/worker-b/vitest.config.ts...
[vpw:inf] Starting single runtime for packages/worker-a/vitest.config.ts...
workerd/jsg/util.c++:274: error: e = kj/filesystem.c++:310: failed: expected part.findFirst('/') == kj::none [(can't stringify) == (can't stringify)]; '/' character in path component; did you mean to use Path::parse()?; part = vitest-pool-workers-runner-@repo/worker-b-__VITEST_POOL_WORKERS_USER_OBJECTMyDurableObject
stack: 102bd4f8f 102bd5187 10032263b 10032247f 1008cffbb 1008cfe8b 1008cfa8f 1008a94d3 1008a9007 100321cf7 100321783 100321633 10031e927 1003261e3 100325ce3 102b81deb 100338ddb 100cfe434 100d00907 1003207ac 100a39e6c 10094ee78; sentryErrorContext = jsgInternalError
 ❯ |@repo/worker-b| src/test/durable-objects.test.ts (1)
   × do stuff
 ✓ |worker-a| src/test/durable-objects.test.ts (1)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  |@repo/worker-b| src/test/durable-objects.test.ts > do stuff
Error: internal error
 ❯ runInStub ../../Users/jh/src/cf-vitest-pkg-name-error/node_modules/.pnpm/@cloudflare+vitest-pool-workers@0.5.18_@cloudflare+workers-types@4.20241011.0_@vitest+runner@_u73y254jh7yvjhwzm7jdqulwny/node_modules/@cloudflare/vitest-pool-workers/dist/worker/lib/cloudflare/test-internal.mjs:139:20
 ❯ src/test/durable-objects.test.ts:15:3
     13|   const id = env.MY_DURABLE_OBJECT.idFromName(crypto.randomUUID())
     14|   const stub = env.MY_DURABLE_OBJECT.get(id)
     15|   await runInDurableObject(stub, async (instance) => {
       |   ^
     16|     expect(instance).instanceOf(MyDurableObject)
     17|   })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 1 passed (2)
   Start at  05:22:06
   Duration  912ms (transform 22ms, setup 0ms, collect 35ms, tests 10ms, environment 0ms, prepare 256ms)

[vpw:dbg] Shutting down runtimes...
 ELIFECYCLE  Test failed. See above for more details.
```
