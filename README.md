# @comandeer/apm

![Build Status](https://github.com/Comandeer/apm/workflows/CI/badge.svg) [![codecov](https://codecov.io/gh/Comandeer/apm/branch/main/graph/badge.svg)](https://codecov.io/gh/Comandeer/apm) [![npm ](https://img.shields.io/npm/v/@comandeer/apm.svg)](https://npmjs.com/package/@comandeer/apm)

Detects the correct JS package manager and uses it.

## Installation

```shell
npm install --global @comandeer/apm
```

## Usage

Just enter the directory of your JS project and replace your package manager binary name with the `apm`, e.g. instead of

```bash
npm install
```

run

```bash
apm install
```

## How does it work?

The `apm` binary detects which package manager is used in the JS project and runs it, passing all received arguments. Currently three package managers are supported:

* [`npm`](https://github.com/npm/cli) (the default one),
* [`pnpm`](https://pnpm.io/),
* [`yarn`](https://yarnpkg.com/).

For now, the algorithm for detecting the right package manager is:

* check for the [`packageManager` field](https://nodejs.org/api/packages.html#packagemanager) inside the nearest [`package.json` file](https://docs.npmjs.com/files/package.json/);
* otherwise, look for the lock files:
	* [`package-lock.json`](https://docs.npmjs.com/cli/v8/configuring-npm/package-lock-json) for `npm`,
	* [`pnpm-lock.yaml`](https://pnpm.io/git#lockfiles) for `pnpm`,
	* [`yarn.lock`](https://classic.yarnpkg.com/lang/en/docs/yarn-lock/) for `yarn`;
* otherwise, fallback to `npm`.

## Known limitations

* `npx`, `pnpx` and `yarn dxl` are not currently supported. There's a plan to add `apx` binary in one of the following versions.

## License

See [LICENSE](./LICENSE) file for details.
