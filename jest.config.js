module.exports = {
    "testMatch": [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
        "^.+\\.(t|j)sx?$": "ts-jest"
    },
    "preset": "ts-jest",
}