// .eslintrc.cjs  (à la racine, là où il y a package.json)
module.exports = {
    root: true,
    env: { browser: true, es2022: true, node: true },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",        // LA LIGNE QUI RÉGLE TON PROBLÈME
        ecmaFeatures: { jsx: true },
    },
    settings: { react: { version: "18.2" } },
    rules: {
        "react/prop-types": "off",
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
    },
};