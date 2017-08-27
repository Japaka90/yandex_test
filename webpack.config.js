const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry:  {
        app: './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
         publicPath: "/",
         contentBase: path.join(__dirname, '')
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Output Management',
            filename: 'index.html',
            template: 'src/index.html'
        }),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
