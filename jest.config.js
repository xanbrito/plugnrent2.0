const nextJest = require('next/jest')
const path = require('path')

// Garantir que estamos no diretório correto
const projectDir = path.resolve(__dirname)

const createJestConfig = nextJest({
  dir: projectDir,
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '<rootDir>/__tests__/setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Focar apenas nos testes do projeto
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
  ],
  // Ignorar tudo que não é do projeto
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/out/',
    '/.vscode/',
    '/dist/',
    '/coverage/',
    '/build/',
    '/.git/',
    // Ignorar extensões do VSCode
    '/.*\\.vscode.*/',
    '/.*extensions.*/',
  ],
  // Apenas procurar no diretório raiz do projeto
  roots: [projectDir],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/__tests__/**',
    '!**/.vscode/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
