const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const webpack = require('webpack');

//NOTE: Image loading

module.exports = (env) => {
  const isProduction = env.NODE_ENV === 'production',
    isDevelopment = env.NODE_ENV === 'development',
    isAnalyze = env.NODE_ENV === 'analyze',
    generateSourceMaps = isAnalyze || env.GENERATE_SOURCE_MAPS === 'true',
    isProductionBuild = isProduction || isAnalyze;

  return {
    entry: './src/components/index.tsx',
    mode: isProductionBuild ? 'production' : isDevelopment && 'development',
    bail: isProduction,
    devServer: {
      historyApiFallback: {
        index: '/',
      },
      port: 3000,
      disableHostCheck: true,
      hot: true,
      open: true,
      openPage: ''
    },
    devtool: isProduction
      ? generateSourceMaps ? 'source-map' : false
      : isDevelopment && 'cheap-module-source-map',
    output: {
      path: path.join(__dirname, '/dist'),
      filename: isProductionBuild
        ? 'static/js/[name].[contenthash:8].js'
        : isDevelopment && 'static/js/[name].bundle.js',
      publicPath: '/',
      chunkFilename: isProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : (isDevelopment || isAnalyze) && 'static/js/[name].chunk.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      plugins: [new TsConfigPathsPlugin()]
    },
    module: {
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true // Disables type checker since it will be done via fork-ts-checker-webpack-plugin
          },
          exclude: ['/**/*.spec.ts', '/**/*.spec.tsx']
        },
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader']
        }
      ]
    },
    optimization: {
      minimize: isProductionBuild,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            sourceMap: generateSourceMaps,
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              comparisons: false,
              inline: 2
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            },
          }
        })
      ],
      splitChunks: {
        chunks: 'all',
        name: false
      },
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      // https://github.com/facebook/create-react-app/issues/5358
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'React Webpack Testing',
        inject: true,
        template: './src/index.html',
        ...(isProductionBuild && {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        })
      }),
      new ForkTsCheckerWebpackPlugin({
        async: false,
        eslint: {
          files: './src/**/*.{tsx,ts,js}'
        }
      }),
      isAnalyze && new BundleAnalyzerPlugin(),
      new CleanWebpackPlugin(),
      // This is necessary to emit hot updates (CSS and Fast Refresh):
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      // Makes some environment variables available to the JS code, for example:
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
        'process.env.SOME_VALUE': JSON.stringify(env.SOME_VALUE || 'default'),
        'process.env.SOME_OTHER_VALUE': JSON.stringify(process.env.SOME_OTHER_VALUE || 'default'),
      }),
      // Makes some environment variables available in index.html.
      new InterpolateHtmlPlugin({
        SOME_VALUE_IN_HTML: 'some value'
      })
    ].filter(Boolean)
  };
};