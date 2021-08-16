import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  preset: '@shelf/jest-dynamodb',
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }

}
export default config
