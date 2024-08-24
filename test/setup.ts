import { config } from 'dotenv'
import fs from 'fs'

const testEnvFile = `.env.test`
const envFile = `.env`

if (!fs.existsSync(envFile)) {
  throw new Error('.env file not found')
}

// Ensure a test environment variable file exists because of the override config
// loading mechanics below.
if (!fs.existsSync(testEnvFile)) {
  throw new Error('.env.test file found')
}

// We don't want to have two dotenv files that are exactly the same, so we
// override the default with .env.test.
//
// If a .env.test file is not found, the DATABASE_URL will fallback to the
// default. Consequently, you'll lose your development database during the
// integration tests teardown. Hence, the check above.
config({ path: envFile })
config({ path: testEnvFile, override: true })
