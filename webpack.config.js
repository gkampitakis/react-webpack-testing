const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');


//NOTE: css plugin


module.exports = (env) => {
  const isProduction = env.NODE_ENV === 'production',
    isDevelopment = env.NODE_ENV === 'development',
    isAnalyze = env.NODE_ENV === 'analyze',
    generateSourceMaps = env.GENERATE_SOURCE_MAPS === 'true';

  return {
    entry: './src/components/index.tsx',
    mode: isProduction || isAnalyze ? 'production' : isDevelopment && 'development',
    bail: isProduction,
    devServer: {
      historyApiFallback: {
        index: '/',
      },
      port: 3001,
      disableHostCheck: true,
      hot: true,
      open: true,
      openPage: ''
    },
    devtool: isProduction
      ? true
        ? 'source-map'
        : false
      : isDevelopment && 'cheap-module-source-map',
    output: {
      path: path.join(__dirname, '/dist'),
      filename: isProduction || isAnalyze
        ? 'static/js/[name].[contenthash:8].js'
        : isDevelopment && 'static/js/bundle.js',
      publicPath: '/',
      chunkFilename: isProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isDevelopment || isAnalyze && 'static/js/[name].chunk.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      plugins: [new TsConfigPathsPlugin()]
    },
    module: { //TODO:
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true // Disables type checker since it will be done via fork-ts-checker-webpack-plugin
          },
          exclude: ['/**/*.spec.ts', '/**/*.spec.tsx', /node_modules/]
        },
      ]
    },
    optimization: {
      minimize: isProduction || isAnalyze,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            sourceMap: isAnalyze,
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
      // runtimeChunk: {
      //   name: entrypoint => `runtime-${entrypoint.name}`
      // }
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      isAnalyze && new BundleAnalyzerPlugin(),
      new CleanWebpackPlugin(),
      // This is necessary to emit hot updates (CSS and Fast Refresh):
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin(env), //TODO: here we can use dotenv
      // Makes some environment variables available in index.html.
      // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
      // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
      // It will be an empty string unless you specify "homepage"
      // in `package.json`, in which case it will be the pathname of that URL.
      // new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
      new HtmlWebpackPlugin({
        title: 'React Webpack Testing',
        inject: true,
        template: './src/index.html',
        ...(isProduction || isAnalyze && {
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
      })
    ].filter(Boolean)
  };
};

// TODO: we want one clean production build
// TODO: we want on development with hot reload
// TODO: we want one production with bundle analyzing