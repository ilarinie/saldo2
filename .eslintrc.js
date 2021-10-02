module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module"
  },
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  rules: {
    "max-len": [
      "error",
      {
        "code": 140
      }
    ]
  }
}