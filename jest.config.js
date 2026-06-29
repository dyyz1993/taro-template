/** Jest 配置：测试纯 TS 工具（不测 React/Taro 组件，避免引入太多依赖） */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: __dirname,
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx', esModuleInterop: true, target: 'ES2017', module: 'CommonJS' } }]
  },
  // 不跑 dist/cloudfunctions 与 babel 配置文件干扰
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/utils/**/*.ts',
    '!src/**/*.d.ts'
  ]
};
