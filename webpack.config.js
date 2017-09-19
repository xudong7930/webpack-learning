const webpack = require('webpack');
const path = require('path');
const glob = require('glob-all')
const inPrd = process.env.NODE_ENV === 'production';
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack');

module.exports = {
    entry: {
        app: [
            './src/main.js',
            './src/main.scss'
        ],
        vender: ['jquery']
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            // 处理js文件
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },

            // 处理font文件
            { test: /\.ttf|eot|woff|woff2$/, loader: 'file-loader', options: {name: "fonts/[name].[ext]"}},

            // 处理.scss|.sass|css文件
            {
                test: /\.sass|scss|css$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            },

            // 处理图片
            {
                test: /\.png|jpeg|jpg|gif|svg$/, 
                use: [
                    {
                        loader: 'file-loader',  // 对图片进行复制
                        options: {name: "img/[name].[ext]"}
                    },
                    'img-loader' //对图像进行优化
                ]
            }
        ]
    },
    plugins: [
        // css文件名称
        new ExtractTextPlugin('[name].css'),

        new webpack.LoaderOptionsPlugin({
            minimize: inPrd
        }),

        // 处理css,只将用到的css编译进文件
        new PurifyCSSPlugin({
            paths: glob.sync([
                path.join(__dirname, 'index.html'),
                path.join(__dirname, 'src/*.html')
            ]),
            minimize: inPrd
        }),
        

        // 编译前删除的目录和文件
        new CleanWebpackPlugin(['dist'], {
            root: __dirname,
            verbose: inPrd,
            dry: false,
            exclude: []
        }),
        

        // 将编译后的文件名称保存到json文件中
        function() {
            this.plugin('done', (stats) => {
                require('fs').writeFileSync(
                    path.join(__dirname, 'dist/manifest.json'), 
                    JSON.stringify(stats.toJson().assetsByChunkName)
                )
            })
        }
    ]
}

// product env
if (inPrd) {
    // 压缩js文件
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    )
}