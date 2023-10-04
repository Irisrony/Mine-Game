// 导入path包
const path = require('path')

// 导入html插件
const HTMLWebpackPlugin = require('html-webpack-plugin')

// 导入clean插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')


// 配置
module.exports = {
    // 环境
    mode: "production",
    // 打包入口
    entry: "./src/index.ts",
    // 打包的输出路径与文件名
    output: {
        path: path.resolve(__dirname,"dist"),
        filename: "bundle.js"
    },
    // 模块化的规则（loaders）
    module: {
        rules: [
            // ts
            {
                // 文件
                test: /\.ts$/,
                // loader
                use: "ts-loader",
                // 排除
                exclude: /node_modules/
            },
            // less
            {
                test: /\.less/,
                use: [
                    "style-loader",
                    "css-loader",
                    // 引入postcss
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions:{
                                plugins:[
                                    [
                                        "postcss-preset-env",
                                        {
                                            browsers: 'last 2 versions'
                                        }
                                    ]
                                ]
                            }
                        }
                    },
                    "less-loader"
                ]
            }
        ]
    },
    // 配置webpack插件
    plugins: [
        new HTMLWebpackPlugin({
            title: "Snake Test",
            // 导入配置模板
            template: "./src/index.html"
        }),
        //new CleanWebpackPlugin()
    ],
    // 设置模块
    resolve: {
        extensions: ['.ts','.js']
    }
}