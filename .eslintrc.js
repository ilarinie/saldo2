module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module"
  },
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
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