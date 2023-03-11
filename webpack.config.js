/* eslint-disable max-len */
const path = require('path');
const glob = require('glob');
const autoprefixer = require('autoprefixer');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const cssnano = require('cssnano');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin');
// const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const BeautifyHtmlWebpackPlugin = require('beautify-html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const {PurgeCSSPlugin} = require('purgecss-webpack-plugin');
const PATHS = {
  src: path.join(__dirname, 'src'),
};

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';
  const isDevelopment = options.mode === 'development';

  return {
    entry: {
      common: './src/index.js',
      image: './src/imageImport.js',
    },
    output: {
      path: path.resolve(__dirname, './public'),
      filename: 'js/[name].js',
      publicPath: '',
    },
    optimization: {
      minimizer: [
        `...`,
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true,
                },
                autoprefixer: true,
              },
            ],
          },
        }),
      ],
      splitChunks: {
        cacheGroups: {
          libs: {
            name: 'libs',
            test: /node_modules.*(?<!\.css)(?<!\.scss)(?<!\.less)$/,
            enforce: true,
            chunks: 'all',
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: [
            {
              loader: 'babel-loader',
            },
          ].filter(Boolean),
          exclude: /node_modules/,
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            {
              loader: isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
              options: isProduction ? {
                publicPath: '../',
              } : {},
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    autoprefixer({grid: 'autoplace'}),
                    cssnano(),
                  ],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  sourceMap: true,
                  includePaths: ['node_modules'],
                  outputStyle: 'expanded', // disabled minimize
                },
              },
            },
          ],
        },
        {
          test: /\.(css)$/,
          use: [
            {
              loader: isProduction ?
                MiniCssExtractPlugin.loader : 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    autoprefixer({grid: 'autoplace'}),
                    cssnano(),
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          exclude: [
            path.resolve(__dirname, './src/img/svg/'),
            path.resolve(__dirname, './src/img/base64/'),
          ],
          type: 'asset/resource',
          generator: {
            filename: 'img/[name][ext]',
          },
        },
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
          include: [
            path.resolve(__dirname, './src/img/svg/'),
          ],
          options: {},
        },
        {
          test: /\.(png|jpg|gif|svg)$/i,
          include: [
            path.resolve(__dirname, './src/img/base64/'),
          ],
          type: 'asset/inline',
        },
        {
          test: /\.(woff|woff2|ttf|otf|eot)$/,
          type: 'asset',
          generator: {
            filename: 'font/[name][ext]',
          },
        },
        {
          test: /\.(json)$/,
          type: 'asset/resource',
          generator: {
            filename: 'img/[name][ext]',
          },
        },
        {
          test: /\.hbs$/,
          loader: 'handlebars-loader',
          options: {
            helperDirs: path.resolve(__dirname, 'helper'),
          },
        },
      ],
    },
    devtool: isProduction ? false : 'eval-source-map',
    devServer: {
      watchFiles: ['src/**/**.hbs'],
      hot: true,
      open: true,
      devMiddleware: {
        publicPath: '/',
      },
    },
    externals: {
      jquery: 'jQuery',
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          '**/*',
          '!model/**',
          '!music/**',
        ]},
      ),
      new SpriteLoaderPlugin(),
      new HtmlWebpackPlugin({
        minify: {
          collapseWhitespace: false,
          removeComments: false,
          collapseInlineTagWhitespace: false,
          minifyCSS: true,
        },
        inject: false,
        title: '',
        filename: 'index.html',
        template: './src/index.hbs',
        chunks: ['common'],
        templateParameters: require('./data.js'),
      }),
      new ESLintPlugin(),
      isProduction && new BeautifyHtmlWebpackPlugin(),
      // new webpack.ProvidePlugin({
      //   $: 'jquery',
      //   jQuery: 'jquery',
      // }),
      isProduction && new RemovePlugin({
        after: {
          test: [
            {
              folder: './public/js',
              method: absoluteItemPath => {
                return new RegExp(/image.*.js/).test(absoluteItemPath);
              },
            },
            {
              folder: './public/js',
              method: absoluteItemPath => {
                return new RegExp(/.txt/).test(absoluteItemPath);
              },
            },
          ],
        },
      }),
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      //   isProduction && new FixStyleOnlyEntriesPlugin({
      //     extensions: ['less', 'scss', 'css', 'sass'],
      //   }),
      isProduction && new MiniCssExtractPlugin({
        filename: './css/style.css',
      }),
      // isProduction && new HtmlCriticalWebpackPlugin({
      //   base: path.resolve(__dirname, 'public'),
      //   src: 'index.html',
      //   dest: 'index.html',
      //   inline: true,
      //   minify: true,
      //   extract: false,
      //   width: 310,
      //   height: 550,
      //   penthouse: {
      //     blockJSRequests: true,
      //   },
      // }),
      // isProduction && new ImageminPlugin({
      //   pngquant: {
      //     quality: '30',
      //   },
      //   plugins: [
      //     imageminPngquant(),
      //     imageminJpegRecompress({
      //       quality: 85,
      //     }),
      //   ],
      // }),
      // new PurgeCSSPlugin({
      //   paths: glob.sync(`${PATHS.src}/**/*`, {nodir: true}),
      //   rejected: true,
      //   safelist: [/^is-open/, /^ct-/],
      // }),
    ].filter(Boolean),
  };
};
