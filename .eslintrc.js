module.exports = {
    root: true,
    "env": {
        "node": "true"
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
       "parser": "babel-eslint"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "no-unused-vars": "off"
    }
};