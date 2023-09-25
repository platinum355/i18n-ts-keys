/* eslint-disable @typescript-eslint/no-var-requires */
const I18nTsKeysPlugin = require('@i18n-ts-keys/webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = () => ({
    entry: './src/index.tsx',
    target: ['web', 'es5'],
    module: {
        rules: [
            {
                test: /\.[tj]sx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: ['node_modules', 'src'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'our project',
            template: 'src/assets/index.html',
        }),
        new I18nTsKeysPlugin({
            inputPath: path.resolve('src/assets/locales/en'),
            outputPath: path.resolve('src/assets/locales/index.ts'),
        }),
    ],
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000,
    },
});
