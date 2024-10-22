const path = require('path');
const JavaScriptObfuscator = require('webpack-obfuscator');
const glob = require('glob');

module.exports = {
    mode: 'production',
    entry: glob.sync('./client/**/*.js'),  // динамический поиск всех JS файлов
    output: {
        filename: 'bundle.js',  // собранный файл
        path: path.resolve(__dirname, 'client'),  // сохранить в папку client
    },
    plugins: [
        new JavaScriptObfuscator({
                rotateStringArray: true,
                reservedNames: ['TonWeb', 'Telegram', 'WebApp'],
                renameProperties: false,
        }, ['!client/tonweb.js'])
    ],
    optimization: {
        minimize: true,  // минимизация
    },
    resolve: {
        preferRelative: true,  // предпочитать относительные пути
    },
};
