const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");

const browserConfig = {
    mode: "development",
    context: __dirname,
    entry: "./src/browser/index.js",
    output: {
        path: __dirname,
        filename: "./public_ssr/bundle.js"
    },
    devtool: "cheap-module-source-map",
    module: {
        rules: [
            {
                test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: "file-loader",
                options: {
                    name: "public_ssr/media/[name].[ext]",
                    publicPath: url => url.replace(/public_ssr/, "")
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            // publicPath: '../'
                        }
                    },
                    {
                        loader: "css-loader",
                        options: { importLoaders: 1 }
                    },
                    {
                        loader: "postcss-loader",
                        options: { plugins: [autoprefixer()] }
                    }
                ]
            },
            {
                test: /js$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                query: { presets: ["react-app"] }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "public_ssr/css/[name].css"
        }),
        new webpack.DefinePlugin({ 'process.env': Object.keys(process.env).reduce(function (o, k) { o[k] = JSON.stringify(process.env[k]); return o; }, {}) })
    ]
};

const serverConfig = {
    mode: "development",
    context: __dirname,
    entry: "./src/server/index.js",
    target: "node",
    output: {
        path: __dirname,
        filename: "server.js",
        libraryTarget: "commonjs2"
    },
    externals: ['express'],
    devtool: "cheap-module-source-map",
    module: {
        rules: [
            {
                test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: "file-loader",
                options: {
                    name: "public_ssr/media/[name].[ext]",
                    publicPath: url => url.replace(/public_ssr/, ""),
                    emit: false
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "css-loader/locals"
                    }
                ]
            },
            {
                test: /js$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                query: { presets: ["react-app"] }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({ 'process.env': Object.keys(process.env).reduce(function (o, k) { o[k] = JSON.stringify(process.env[k]); return o; }, {}) })
    ]
};

module.exports = [browserConfig, serverConfig];
