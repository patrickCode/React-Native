const webpack = require('webpack');

module.exports = {
    entry: "./src/app.js",
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".js"]
    },

    module: {
        rules: [
            // All files with a '.js' or '.jsx' extension will be handled by 'babel-loader'.
            {test: /\.jsx??/, loader: 'babel-loader'},
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            __DEV__: process.env.NODE_ENV === 'production' || true
          })
        ]
};