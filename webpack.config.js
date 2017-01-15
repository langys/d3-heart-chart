var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

if (process.env.NODE_ENV != 'production') process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var PRODUCTION = process.env.NODE_ENV == 'production';

var config = {
    entry: {
        app: './src/index',
    },

    output: {
        path: path.resolve('dist'),
        filename: PRODUCTION ? '[name]-[chunkhash].js' : '[name].js',
        publicPath: PRODUCTION ? 'https://wonderbeyond.github.io/d3-heart-chart/dist/' : '/',
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    // Refer to: https://github.com/vuejs/vue-loader/blob/master/docs/en/configurations/extract-css.md#webpack-2x-210-beta25
                    css: ExtractTextPlugin.extract({
                        loader: 'css-loader',
                        fallbackLoader: 'vue-style-loader'
                    })
                }
            }
        },{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        },{
            test: /\.(jpg|png|gif|svg)$/,
            loader: 'file-loader',
        }]
    },
    resolve: {
        mainFields: ["browser", "module", "jsnext:main", "main"],
        modules: [
            'src',
            'node_modules',
        ],
        alias: {
            // vue: 'vue/dist/vue.js'
        },
    },
    plugins: [
        new webpack.ProvidePlugin({}),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new ExtractTextPlugin(PRODUCTION ? '[name]-[chunkhash].css' : '[name].css'),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.DefinePlugin({}),
        new webpack.LoaderOptionsPlugin({
            vue: {
                // use custom postcss plugins
                postcss: function(webpack) {
                    return [
                        // require('precss')(),
                        // require('postcss-import')({addDependencyTo: webpack}),
                        // require('postcss-partial-import')({addDependencyTo: webpack}),
                        require('postcss-smart-import')({
                            addDependencyTo: webpack,
                            // root: path.resolve('src'),   // WARN: Not work as expected!
                            path: [path.resolve('src')],
                        }),
                        require('postcss-mixins'),
                        // require('postcss-nested'),
                        require('postcss-cssnext')({
                            'browsers': [
                                '> 1%',
                                'last 2 versions',
                                'ios_saf >= 6',
                            ]
                        }),
                        require('postcss-simple-vars')(),
                    ];
                }
            }
        }),
    ],
    devtool: 'source-map',
};

PRODUCTION && Array.prototype.push.apply(config.plugins, [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
]);

module.exports = config;
