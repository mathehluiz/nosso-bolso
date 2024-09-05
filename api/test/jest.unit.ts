import config from './jest.shared'

export default {
  ...config,
  testMatch: ['<rootDir>/src/**/__test__/unit/**/*.spec.ts'],
}
