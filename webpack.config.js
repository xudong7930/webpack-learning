const webpack = require('webpack');
const path = require('path');
const inPrd = process.env.NODE_ENV === 'production';
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: [
            './src/main.js',
            './src/main.scss'
        ]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            // { test: /\.s[ac]ss$/, use: ['style-loader', 'css-loader', 'sass-loader']},
            {
                test: /\.s[ac]ss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            },
            { test: /\.css$/, use: ['style-loader', 'css-loader']},
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin() //minization
        new ExtractTextPlugin('[name].[hash].css'),
        new webpack.LoaderOptionsPlugin({
            minimize: inPrd
        })
    ]
}

if (inPrd) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    )
}