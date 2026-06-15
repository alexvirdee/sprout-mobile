/**
 * Jest config for auth logic tests (service, store, validation). Uses ts-jest
 * directly and mocks the two native Expo modules in the import chain, so no
 * heavyweight RN renderer is needed. Path aliases mirror babel.config.js.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@app-types/(.*)$': '<rootDir>/src/types/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@theme/(.*)$': '<rootDir>/src/theme/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^expo-secure-store$': '<rootDir>/src/__tests__/mocks/expo-secure-store.ts',
    '^expo-constants$': '<rootDir>/src/__tests__/mocks/expo-constants.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { module: 'CommonJS', esModuleInterop: true, skipLibCheck: true } }],
  },
};
