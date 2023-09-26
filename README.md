<h1 align='center'>I18n-ts-keys</h1>

[//]: # (<p align="center">)

[//]: # (<a href="https://www.npmjs.com/package/@i18n-ts-keys/webpack-plugin" target="__blank"><img src="https://img.shields.io/npm/v/@i18n-ts-keys/webpack-plugin?style=flat&colorA=002438&colorB=28CF8D" alt="NPM version"></a>)

[//]: # (<a href="https://www.npmjs.com/package/@i18n-ts-keys/webpack-plugin" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@i18n-ts-keys/webpack-plugin?flat&colorA=002438&colorB=28CF8D"></a>)

[//]: # (<a href="https://github.com/platinum355/i18n-ts-keys" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/platinum355/i18n-ts-keys?flat&colorA=002438&colorB=28CF8D"></a>)

[//]: # (</p>)

<p align="center">
Webpack plugin for generation typed i18n keys constant.
</p>

## Highlights

- 🌱 Exclude string keys
- 💎 Use a typed constant
- 🚀 Destructure the keys constant
- ✂️ Tree shaking
- 🔗 Typing hints

## Install

```bash
npm i @i18n-ts-keys/webpack-plugin --save-dev
```

### Quick Setup

Add webpack plugin with required input params

```ts
const I18nTsKeysPlugin = require('@i18n-ts-keys/webpack-plugin');

module.exports = () => ({
    //...
    plugins: [
        new I18nTsKeysPlugin({
            inputPath: path.resolve('src/assets/locales/en'),
            outputPath: path.resolve('src/assets/locales/index.ts'),
        }),
    ],
})
```

`inputPath` - path to one of the directories with translations

`outputPath` - path to output .ts file (will be created)


## Using

Just import `Translation` constant from output path and use it !

Recommend adding the generated file to .gitignore

```jsx
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Translations} from './assets/locales';

const {
    Template: {Simple, Plurals, Context},
    Template,
} = Translations;

/** Example app. */
export const App = () => {
    const {t} = useTranslation();

    return (
        <div>
            <h1>{t(Template.Header)}</h1>
            <h4>{t(Simple.title)}</h4>
            <h2>{t(Plurals.header)}</h2>
            <ul>
                <li>{t(Plurals.example, {count: 1})}</li>
                <li>{t(Plurals.example, {count: 2})}</li>
                <li>{t(Plurals.example, {count: 5})}</li>
            </ul>
            <h2>{t(Context.header)}</h2>
            <ul>
                <li>{t(Context.contextExample, {context: 'first'})}</li>
                <li>{t(Context.contextExample, {context: 'second'})}</li>
            </ul>
        </div>
    );
};
```

## Context and pluralization rights

- `AA_BB_CC` - without context
- `AA_BB_1` - without context
- `aA_BB_CC` - context is BB_CC
- `aA_bB` - context is bB
- `AA_BB_cC` - context is cC
- `AA_BB_plural` - plural
- `aA_plural` - plural
- `aA_1` - plural


## Example

- Clone [repo](https://github.com/platinum355/i18n-ts-keys.git) and run `npm start`.
- See http://localhost:3000

## Eslint-plugin

The plugin prohibits the use of strings as arguments and has auto-correction.

### Install

```bash
npm i @i18n-ts-keys/eslint-plugin --save-dev
```

.eslintrc.js
```ts
module.exports = {
    //...
    plugins: ['@i18n-ts-keys'],
    rules: {
        //...
        '@i18n-ts-keys/no-translation-string-key': 'error',
    }
}
```

## License

MIT License © 2023-PRESENT [Michael Mishin](https://github.com/platinum355)
