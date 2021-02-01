<h1 align="center"> React Webpack Testing </h1>

<p align="center">
 <img src="./docs/webpackIcon.png" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img src="./docs/reactIcon.png" width="45%">
</p>

## Description

In this repository, I am trying to configure webpack for serving in dev and bundling in production with the best possible way.

It contains a simple react app with:

-   [React Router](https://reactrouter.com/web/guides/quick-start)
-   [Material UI](https://material-ui.com/) and [Material UI Icons](https://material-ui.com/components/material-icons/)

## Goals

-   As small as possible bundle served to the end user
-   Good developer experience with hot reloading and fast builds
-   Inspecting bundle sizes

## Running the app

-   `npm run start` Spins up the webpack dev server with HRM enabled.
-   `npm run build` Builds the production bundle and outputs the chunk sizes.
-   `npm run analyze` Builds the production bundle but opens `webpack-bundle-analyzer` dashboard.

### Plugins and sources used

-   `interpolate-html-plugin`
-   `webpack-bundle-analyzer`
-   `bundlesize`
-   `tsconfig-paths-webpack-plugin`
-   `terser-webpack-plugin`
-   `fork-ts-checker-webpack-plugin`
-   `clean-webpack-plugin`
-   `html-webpack-plugin`
-   Also I relied in the [CRA](https://create-react-app.dev/) webpack configuration and official documentation of [Webpack](https://webpack.js.org/) for best practices and help.

### Known Issues

If you try to build or run the webpack there is a warning coming from `html-webpack-plugin`

```bash
(node:19910) [DEP_WEBPACK_COMPILATION_ASSETS] DeprecationWarning: Compilation.assets will be frozen in future, all modifications are deprecated.
BREAKING CHANGE: No more changes should happen to Compilation.assets after sealing the Compilation.
	Do changes to assets earlier, e. g. in Compilation.hooks.processAssets.
	Make sure to select an appropriate stage from Compilation.PROCESS_ASSETS_STAGE_*.
```

There is a fix in a later version of it. For more you can check issue [#1523](https://github.com/jantimon/html-webpack-plugin/issues/1523).

<br/>

> Some interesting links:
>
> -   https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules
> -   https://webpack.js.org/guides/production/#setup
> -   https://webpack.js.org/guides/tree-shaking/
> -   https://webpack.js.org/guides/lazy-loading/
> -   https://reactjs.org/docs/code-splitting.html
> -   https://v1.material-ui.com/style/icons/
> -   https://material-ui.com/guides/minimizing-bundle-size/
