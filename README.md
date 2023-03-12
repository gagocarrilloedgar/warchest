# Warchest-lite

## Features

- [TypeScript](https://www.typescriptlang.org/) (v4)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/) with:
  - [Codely's config](https://github.com/lydell/eslint-plugin-simple-import-sort/) (includes ESLint's recommended rules, Prettier, Import plugin and more)
  - [Jest plugin](https://www.npmjs.com/package/eslint-plugin-jest)
- [Jest](https://jestjs.io) with [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro)
- [GitHub Action workflows](https://github.com/features/actions) set up to run tests and linting on push
- [SWC](https://swc.rs/): Execute your tests in less than 200ms

## Working with this project

- Execute the gam: `npm run dev`
- Install the dependencies: `npm install`
- Execute the tests: `npm run test`
- Check linter errors: `npm run lint`
- Fix linter errors: `npm run lint:fix`

There is no specific command to start the app, we leave that up to you. If you wish to create a specific type of app (web, API…), we recommend checking the templates below.

## Changelog

- Add board initialization
- Add prompter
- Add player and
- Add information to show when prompting
- Add Base game loop
- Add selector error handler
- Add forfeit action hanlder and information about the winner
- Add base unit and different user value objetcs to handle units
- Add init coin shaffle information

## Acknowledgments

- [Codely typescript skeleton](https://github.com/CodelyTV/typescript-basic-skeleton)
