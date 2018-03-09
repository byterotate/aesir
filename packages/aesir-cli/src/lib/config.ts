export const prettierConfig = {
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: false,
  semi: false,
  tabWidth: 2,
  printWidth: 120,
}

export const prettierConfigByExt = {
  js: {
    singleQuote: true,
    trailingComma: 'all',
    bracketSpacing: false,
    semi: false,
    tabWidth: 2,
    printWidth: 120,
  },
  vue: {
    singleQuote: true,
    trailingComma: 'all',
    bracketSpacing: false,
    semi: false,
    tabWidth: 2,
    printWidth: 120,
  },
  json: { "parser": "json" }
}

export const eslintBaseConfig = {
  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    }
  },
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  plugins: [
    'html',
    'json',
  ],
}