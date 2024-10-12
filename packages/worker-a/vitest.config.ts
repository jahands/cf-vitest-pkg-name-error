import { defineWorkersProject } from "@cloudflare/vitest-pool-workers/config"

export default defineWorkersProject({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: `${__dirname}/wrangler.toml` },
        isolatedStorage: false,
        singleWorker: true,
      },
    },
  },
})
