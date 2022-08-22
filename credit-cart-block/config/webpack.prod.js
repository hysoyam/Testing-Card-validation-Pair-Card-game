import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

export default {
  entry: "./src/js/index.js",

  output: {
    filename: '[fullhash:8].bundle.js',
    clean: true,
    path: path.resolve(path.resolve(), 'dist'),
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
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
          MiniCssExtractPlugin.loader,
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

  mode: 'production',

  devServer: {
    hot: true,
    static: './dist',

  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template:'./src/html/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[hash:8].[name].css',
    })
  ],

  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {

            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                "svgo",
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      // customize plugin options
                      convertShapeToPath: {
                        convertArcs: true
                      },
                      // disable plugins
                      convertPathData: false,
                      removeComments: true,
                      removeEmptyAttrs: true,
                      removeViewBox: true,
                    }
                  }
                }
              ],
            ],
          },
        },
      }),
    ],
  },
}



