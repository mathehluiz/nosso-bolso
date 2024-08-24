import config from './jest.shared'

export default {
  ...config,
  testMatch: ['<rootDir>/src/**/__test__/integration/**/*.spec.ts'],
}
