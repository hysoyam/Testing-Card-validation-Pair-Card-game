import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
  entry: "./src/js/index.js",


  mode: 'development',
  devtool: 'eval-source-map',

  devServer: {
    open: true,
    static: {
      directory: path.resolve(path.resolve(), 'dist')
    },
  },

  output: {
    filename: '[fullhash:8].bundle.js',
    clean: true,
    path: path.resolve(path.resolve(), 'dist'),
  },

  module: {

    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        include: path.resolve(path.resolve(), 'src'),
        generator: {
          filename: 'assets/[hash:8].[name].[ext]',
          // outputPath: 'assets/',
        },
      },

      {
        test: /\.scss$/,
        include: path.resolve(path.resolve(), 'src'),
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.js$/,
        include: path.resolve(path.resolve(), 'src'),
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        generator: {
          filename: '[fullhash:8].[name].[ext]',
        },
      }
    ],
  },





  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/html/index.html',
      inject: true
    }),
  ],
}



