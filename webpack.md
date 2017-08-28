## Webpack checksheet

[TOC]

### 入门
> 本文档中使用的[webpack版本](https://github.com/webpack/webpack/releases)![GitHub release](https://img.shields.io/npm/v/webpack.svg?label=webpack&style=flat-square&maxAge=3600)

> #### 什么是Webpack
>
> *webpack* 是一个现代 JavaScript 应用程序的*模块打包器(module bundler)*。当 webpack 处理应用程序时，它会递归地构建一个*依赖关系图(dependency graph)*，其中包含应用程序需要的每个模块，然后将所有这些模块打包成少量的 *bundle* - 通常只有一个，由浏览器加载。
>
> #### WebPack和Grunt以及Gulp相比有什么特性
> 其实Webpack和另外两个并没有太多的可比性，Gulp/Grunt是一种能够优化前端的开发流程的工具，而WebPack是一种模块化的解决方案，不过Webpack的优点使得Webpack在很多场景下可以替代Gulp/Grunt类的工具。webpack 把[每个文件(.css, .html, .scss, .jpg, etc.) 都作为模块](https://doc.webpack-china.org/concepts/modules)处理。然而 webpack 自身**只理解 JavaScript**。

> #### 四个核心概念
> `入口(entry)`、`输出(output)`、`loader`、`插件(plugins)`。

> gulp/grunt 工作方式：
> ![gulp/grunt 工作方式：](asserts/gulp.png)
> webpack 工作方式：
> ![webpack.png](asserts/webpack.png)

### 什么是 webpack 模块
> 对比 Node.js 模块，webpack 模块能够以各种方式表达它们的依赖关系，几个例子如下：
- ES2015 import 语句
- CommonJS require() 语句
- AMD define 和 require 语句
- css/sass/less 文件中的 @import 语句。
- 样式(url(...))或 HTML 文件(<img src=...>)中的图片链接(image url)

> webpack 1 需要特定的 loader 来转换 ES 2015 `import`，然而通过 webpack 2 可以开箱即用。



### 安装

```bash
npm install --save-dev webpack
# or
npm install --save-dev webpack@<version>
```

> 对于大多数项目，我们建议本地安装(` --save-dev`)。这可以使我们在引入破坏式变更(breaking change)的依赖时，更容易分别升级项目。通常，webpack 通过运行一个或多个 [npm scripts](https://docs.npmjs.com/misc/scripts)，会在本地 `node_modules` 目录中查找安装的 webpack:
>
> ```
> "scripts": {
>     "start": "webpack --config webpack.config.js"
> }
> ```

### 定义入口文件

- 单入口(简写)

```javascript
const config = {
  entry: './path/to/my/entry/file.js'
};

module.exports = config;


//是以下写法的简写形式
const config = {
  entry: {
    main: './path/to/my/entry/file.js'
  }
};
```

- 对象写法

```javascript
//对象写法，此方法扩展性比较好
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
};
```

#### entry用法的一些常用实例

- 分离app和第三方库

```javascript
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
};
```

> **这是什么？**从表面上看，这告诉我们 webpack 从 `app.js` 和 `vendors.js` 开始创建依赖图(dependency graph)。这些依赖图是彼此完全分离、互相独立的（每个 bundle 中都有一个 webpack 引导(bootstrap)）。这种方式比较常见于，只有一个入口起点（不包括 vendor）的单页应用程序(single page application)中。
>
> **为什么？**此设置允许你使用 `CommonsChunkPlugin` 从「应用程序 bundle」中提取 vendor 引用(vendor reference) 到 vendor bundle，并把引用 vendor 的部分替换为 `__webpack_require__()` 调用。如果应用程序 bundle 中没有 vendor 代码，那么你可以在 webpack 中实现被称为[长效缓存](https://doc.webpack-china.org/guides/caching)的通用模式。

- 多页面应用程序

```javascript
const config = {
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js'
  }
};
```

> **这是什么？**我们告诉 webpack 需要 3 个独立分离的依赖图（如上面的示例）。
>
> **为什么？**在多页应用中，（译注：每当页面跳转时）服务器将为你获取一个新的 HTML 文档。页面重新加载新文档，并且资源被重新下载。然而，这给了我们特殊的机会去做很多事：
>
> - 使用 `CommonsChunkPlugin` 为每个页面间的应用程序共享代码创建 bundle。由于入口起点增多，多页应用能够复用入口起点之间的大量代码/模块，从而可以极大地从这些技术中受益。
>
> > 根据经验：每个 HTML 文档只使用一个入口起点。

### 输出文件定义

> 配置 output 选项可以控制 webpack 如何向硬盘写入编译文件。注意，即使可以存在多个入口起点，但只指定一个输出配置。在 webpack 中配置 `output` 属性的最低要求是，将它的值设置为一个对象，包括以下两点：
>
> - `filename` 用于输出文件的文件名。
> - 目标输出目录 `path` 的绝对路径。

```javascript
const config = {
  output: {
    filename: 'bundle.js',
    path: '/home/proj/public/assets'
  }
};

module.exports = config;
```

如果配置创建了多个单独的 "chunk"（例如，使用多个入口起点或使用像 CommonsChunkPlugin 这样的插件），则应该使用[占位符(substitutions)](https://doc.webpack-china.org/configuration/output#output-filename)来确保每个文件具有唯一的名称。

```javascript
{
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
}

// 写入到硬盘：./dist/app.js, ./dist/search.js
```

- 以下是使用 CDN 和资源 hash 的复杂示例：

```javascript
output: {
  path: "/home/proj/cdn/assets/[hash]",
  publicPath: "http://cdn.example.com/assets/[hash]/"
}
```





###sourceMap配置

> 当 webpack 打包源代码时，可能会很难追踪到错误和警告在源代码中的原始位置。例如，如果将三个源文件（`a.js`, `b.js` 和 `c.js`）打包到一个 bundle（`bundle.js`）中，而其中一个源文件包含一个错误，那么堆栈跟踪就会简单地指向到 `bundle.js`。这并通常没有太多帮助，因为你可能需要准确地知道错误来自于哪个源文件。
>
> 为了更容易地追踪错误和警告，JavaScript 提供了 [source map](http://blog.teamtreehouse.com/introduction-source-maps) 功能，将编译后的代码映射回原始源代码。如果一个错误来自于 `b.js`，source map 就会明确的告诉你。

配置devtool选项：

##### 参考:

| devtool                      |  构建  | 重构建  | 生产环境 |     特性      |
| ---------------------------- | :--: | :--: | :--: | :---------: |
| eval                         | +++  | +++  |  no  |   生成后的代码    |
| cheap-eval-source-map        |  +   |  ++  |  no  | 转换过的代码（仅限行） |
| cheap-source-map             |  +   |  o   | yes  | 转换过的代码（仅限行) |
| cheap-module-eval-source-map |  o   |  ++  |  no  |  原始源码（仅限行）  |
| cheap-module-source-map      |  o   |  -   | yes  |  原始源码（仅限行）  |
| eval-source-map              |  -   |  +   |  no  |    原始源码     |
| source-map                   |  --  |  --  | yes  |    原始源码     |
| inline-source-map            |  --  |  --  |  no  |    原始源码     |
| hidden-source-map            |  --  |  --  | yes  |    原始源码     |
| nosources-source-map         |  --  |  --  | yes  |    无源码内容    |

>+表示较快，- 表示较慢，o 表示时间相同

##### 对于开发环境

以下选项是开发的理想选择：

`eval` - 每个模块都使用 `eval()` 执行，并且都有 `//@ sourceURL`。此选项会相当快地构建。主要缺点是，由于会映射到转换后的代码，而不是映射到原始代码，所以不能正确的显示显示行数。

`inline-source-map` - SourceMap 转换为 DataUrl 后添加到 bundle 中。

`eval-source-map` - 每个模块使用 `eval()` 执行，并且 SourceMap 转换为 DataUrl 后添加到 `eval()` 中。初始化 SourceMap 时比较慢，但是会在重构建时提供很快的速度，并且生成实际的文件。行数能够正确映射，因为会映射到原始代码中。

和 `eval-source-map` 类似，每个模块都使用 `eval()` 执行。然而，使用此选项，Source Map 将传递给 `eval()` 作为 Data URL 调用。它是“低性能开销”的，因为它没有映射到列，只映射到行数。

`cheap-module-eval-source-map` - 和 `cheap-eval-source-map` 类似，然而，在这种情况下，loader 能够处理映射以获得更好的结果。

##### 生产环境

这些选项通常用于生产环境中：

`source-map` - 生成完整的 SourceMap，输出为独立文件。由于在 bundle 中添加了引用注释，所以开发工具知道在哪里去找到 SourceMap。

`hidden-source-map` - 和 `source-map` 相同，但是没有在 bundle 中添加引用注释。如果你只想要 SourceMap 映射错误报告中的错误堆栈跟踪信息，但不希望将 SourceMap 暴露给浏览器开发工具。

`cheap-source-map` - 不带列映射(column-map)的 SourceMap，忽略加载的 Source Map。

`cheap-module-source-map` - 不带列映射(column-map)的 SourceMap，将加载的 Source Map 简化为每行单独映射。

`nosources-source-map` - 创建一个没有 `sourcesContent` 的 SourceMap。它可以用来映射客户端（译者注：指浏览器）上的堆栈跟踪，而不会暴露所有的源码。

### 本地开发工具

> 每次要编译代码时，手动运行 `npm run build` 就会变得很麻烦。
>
> webpack 中有几个不同的选项，可以帮助你在代码发生变化后自动编译代码：
>
> 1. webpack's Watch Mode
> 2. webpack-dev-server
> 3. webpack-dev-middleware
>
> 多数场景中，你可能需要使用 `webpack-dev-server`，但是不妨探讨一下以上的所有选项。

#### devServer配置：

```javascript
devServer: {
  contentBase: path.join(__dirname, "dist"), //支持数组，多路径
  compress: true, //Enable gzip compression for everything served:
  port: 9000, //content is served from dist
  clientLogLevel: "warning", //日志级别 [none|error|warning|info(default)],
  color: true, //Enables/Disables colors on the console.

  lazy: true,
  filename: 'bundle.js', //需要和lazy配合使用，懒编译模式，只在bundle.js被请求时编译它

  headers: {
    //给所有请求增加额外的请求头
    "x-custom-token": "xxxx"
  },
  historyApiFallback: true, //SPA中常用，把所有页面请求指向但一页面，如index.html
  // 更多配置的用法，支持rewrite
  historyApiFallback: {
    rewrites: [
      { from: /^\/$/, to: '/views/landing.html' },
      { from: /^\/subpage/, to: '/views/subpage.html' },
      { from: /./, to: '/views/404.html' }
    ]
  },

  host: '127.0.0.2', //指定host地址，默认localhost
  hot: true, //Enable webpack's Hot Module Replacement feature
  https: true,
  inline: true, //默认true, 打包后的js文件中会植入一段脚本来控制热重载，编译信息会显示在console中。false则通过iframe方式来显示
  open: true, //是否打开浏览器 webpack-dev-server --open
  openPage: '/different/page',//指定打开浏览器后跳转的页面
  overlay: {
    //Shows a full-screen overlay in the browser when there are compiler errors or warnings. Disabled by default. If you want to show only compiler errors:
    warnings: true,
    errors: true
  },

  //usage1
  proxy: {
      "/api": {
          target: "http:localhost:3000",
          pathRewrite: { "^/api": "" }
      },
      "/backend": {
          target: "https: abc.com",
          secure: false //https 需要此选项
      }
  },
  //usage2
  proxy: [
    {
	  context: ["/auth", "/api"],
      target: "localhost:3000"
    }
  ]

  // 获取Express中的app具柄，可以用来自定义中间件
  setup(app) {
      app.get('/some/path', function (req, res) {
         res.send({custom: "response"});
      })
  },
  watchContentBase: true, //Tell the server to watch the files served by the devServer.contentBase option. File changes will trigger a full page reload.
}
```
> 使用NodeJs API 方式时此配置将被忽略，NodeJs API 方式使用devServer的例子：
>
> [https://webpack.js.org/configuration/dev-server/#devserver](https://webpack.js.org/configuration/dev-server/#devserver)
>
> [https://github.com/webpack/webpack-dev-server/blob/master/examples/node-api-simple/server.js](https://github.com/webpack/webpack-dev-server/blob/master/examples/node-api-simple/server.js)

#### 使用webpack的观察者模式

```javascript
 {
    "name": "development",
    "version": "1.0.0",
    "description": "",
    "main": "webpack.config.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
+     "watch": "webpack --watch",
      "build": "webpack"
    }
  }
```

> 现在，你可以在命令行中运行 `npm run watch`，就会看到 webpack 编译代码，然而却不会退出命令行。这是因为 script 脚本还在观察文件。
>
> 唯一的缺点是，为了看到修改后的实际效果，你需要刷新浏览器。如果能够自动刷新浏览器就更好了，这时可以尝试使用 `webpack-dev-server`，恰好可以实现我们想要的功能。

### Loader 配置

> loader 用于对模块的源代码进行转换。loader 可以使你在 `import` 或"加载"模块时预处理文件。因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的强大方法。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript，或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 `import` CSS文件！
>
> 在你的应用程序中，有三种使用 loader 的方式：
>
> - 配置（推荐）：在 **webpack.config.js** 文件中指定 loader。
> - 内联：在每个 `import` 语句中显式指定 loader。
> - CLI：在 shell 命令中指定它们。
>
>
> *⚠️ loader的处理维度是文件，有点类似gulp一类的任务构建方式*。

> [Loaders 列表](https://doc.webpack-china.org/loaders/)

#### Babel 配置

> React 为例

```Bash
npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react
```
- 基本用法

```javascript
//webpack.config.js
module: {
  rules: [
    {
      test: /(\.jsx|\.js)$/,
      use: {
        loader: "babel-loader",
        options: {
          presets: [
            "es2015", "react"
          ]
        }
      },
      exclude: /node_modules/
    }
  ]
}
```

- 使用.babelrc

```javascript
//webpack.config.js
module: {
  rules: [
    {
      test: /(\.jsx|\.js)$/,
      use: {
        loader: "babel-loader",
      },
      exclude: /node_modules/
    }
  ]
}
```

```javascript
// .babelrc
{
  "presets": ["react", "es2015"]
}
```

#### CSS配置

```javascript
module: {
    rules: [
        {
            test: /\.css$/,
          	use: [
                {loader: 'style-loader'},
              	{
                  loader: 'css-loader',
                  options: {
                      module: true //使用模块方式引用css样式
                  }
                }
            ]
        }
    ]
}
```

> webpack提供两个工具处理样式表，`css-loader` 和 `style-loader`，二者处理的任务不同，`css-loader`使你能够使用类似`@import` 和 `url(...)`的方法实现 `require()`的功能,`style-loader`将所有的计算后的样式加入页面中，二者组合在一起使你能够把样式表嵌入webpack打包后的JS文件中。

>使用模块方式引用css
>
>```scss
>/**Greeter.css**/
>.root {
>  background-color: #eee;
>  padding: 10px;
>  border: 3px solid #ccc;
>}
>```
>
>```javascript
>import styles from './Greeter.css';
>class Greeter extends Component{
>  render() {
>    return (
>      <div className={styles.root}>
>        {config.greetText}
>      </div>
>    );
>  }
>}
>```



#### CSS预处理器

> 常用： less-loader, sass-loader, stylus-loader, posts-loader

例子：postcss 配置

```javascript
{
  test: /\.css$/,
    use: [
      {
        loader: "style-loader"
      }, {
        loader: "css-loader",
        options: {
          modules: true
        }
      }, {
        loader: "postcss-loader"
      }
    ]
}
```

```javascript
// postcss.config.js
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```



#### 内联方式使用loader

```javascript
import Styles from 'style-loader!css-loader?modules!./styles.css';
```

> 尽可能使用 `module.rules`，因为这样可以减少源码中的代码量，并且可以在出错时，更快地调试和定位 loader 中的问题。

#### CLI方式使用Loader

你也可以通过 CLI 使用 loader：

```
webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'

```

这会对 `.jade` 文件使用 `jade-loader`，对 `.css` 文件使用 [`style-loader`](https://doc.webpack-china.org/loaders/style-loader) 和 [`css-loader`](https://doc.webpack-china.org/loaders/css-loader)。

#### Loader特性

- loader 支持链式传递。能够对资源使用流水线(pipeline)。一组链式的 loader 将按照先后顺序进行编译。loader 链中的第一个 loader 返回值给下一个 loader。*在最后一个 loader，返回 webpack 所预期的 JavaScript*。
- loader 可以是同步的，也可以是异步的。
- loader 运行在 Node.js 中，并且能够执行任何可能的操作。
- loader 接收查询参数。用于对 loader 传递配置。
- loader 也能够使用 `options` 对象进行配置。
- 除了使用 `package.json` 常见的 `main` 属性，还可以将普通的 npm 模块导出为 loader，做法是在 `package.json` 里定义一个 `loader` 字段。
- 插件(plugin)可以为 loader 带来更多特性。
- loader 能够产生额外的任意文件。

#### Loader的解析和编写

loader 遵循标准的[模块解析](https://doc.webpack-china.org/concepts/module-resolution/)。多数情况下，loader 将从[模块路径](https://doc.webpack-china.org/concepts/module-resolution/#module-paths)（通常将模块路径认为是 `npm install`, `node_modules`）解析。

loader 模块需要导出为一个函数，并且使用 Node.js 兼容的 JavaScript 编写。通常使用 npm 进行管理，但是也可以将自定义 loader 作为应用程序中的文件。按照约定，loader 通常被命名为 `xxx-loader`（例如 `json-loader`）。有关详细信息，请查看[如何编写 loader？](https://doc.webpack-china.org/development/how-to-write-a-loader)。



### 插件(Plugins)配置

> 插件（Plugins）是用来拓展Webpack功能的，它们会在整个构建过程中生效，执行相关的任务。Loaders和Plugins常常被弄混，但是他们其实是完全不同的东西，可以这么来说，loaders是在打包构建过程中用来处理源文件的（JSX，Scss，Less..），一次处理一个，插件并不直接操作单个文件，它直接对整个构建过程其作用。
>
> 官方插件列表： [https://webpack.js.org/plugins/](https://webpack.js.org/plugins/)

#### Html-webpack-plugin

> 这个插件的作用是帮你生成自动引用你打包后的JS和CSS文件的HTML5文件，例如自动生成`index.html`。这在每次生成的js文件名称不同时非常有用（比如添加了`hash`值）.

```shell
npm install --save-dev html-webpack-plugin
```

```javascript
//usage
plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html"
        })
    ]

// or
plugins: [
    new HtmlWebpackPlugin({
      title: 'page title',
      filename: 'index.html', //defaults to index.html
      template: 'xxx',
      /**
       * true | 'body' | 'head'| false,
       * true 和 'body'都会把script标签置于body内容的底部
       **/
      inject: true,
      favicon: path.resolve(__dirname, './image/favicon.png'),
      minify: {
          // Pass html-minifier's options as object to minify the output.
          // 用来压缩html的
      },
      hash: true, //if true then append a unique webpack compilation hash to all included scripts and CSS files. This is useful for cache busting.
      xhtml: false, //defaults to false. 兼容xhtml, <link /> 生成这种形式的self-closing标签
    })
]
```

> [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference)

每一个实例会new 一个html 文件，因此可以添加多个实例生成多个html

```javascript
{
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin(), // Generates default index.html
    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: 'test.html',
      template: 'src/assets/test.html'
    })
  ]
}
```

使用 loader + html 模版引擎

```javascript
{
  module: {
    loaders: [
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader'
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.hbs'
    })
  ]
}
```

#### Extract-text-webpack-plugin

> 把内容独立于打包输出文件输出

```shell
npm install --save-dev extract-text-webpack-plugin
```

```javascript
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },
  plugins: [
    //May contain [name], [id] and [contenthash]
    // new ExtractTextPlugin("[name]-[contenthash].css"),
    new ExtractTextPlugin("styles.css"),
  ]
}
```

> 上例把所有*.css文件单独打包成一个CSS文件，这样在浏览器中css文件和js文件可以并行加载，如果打包后文件很大的话，和单独加载一个很大的js文件相比，这样可以加快加载速度。

> ​ :warning: `ExtractTextPlugin` generates a file **per entry**, so you must use `[name]`, `[id]` or `[contenthash]` when using multiple entries.

- 多个实例

```javascript
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Create multiple instances
const extractCSS = new ExtractTextPlugin('stylesheets/[name]-one.css');
const extractLESS = new ExtractTextPlugin('stylesheets/[name]-two.css');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractCSS.extract([ 'css-loader', 'postcss-loader' ])
      },
      {
        test: /\.less$/i,
        use: extractLESS.extract([ 'css-loader', 'less-loader' ])
      },
    ]
  },
  plugins: [
    extractCSS,
    extractLESS
  ]
};
```

- ##### Sass or Less

```javascript
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css')
    //if you want to pass in options, you can do so:
    //new ExtractTextPlugin({
    //  filename: 'style.css'
    //})
  ]
}
```

- 修改文件名

```javascript
entry: {
  'js/a': "./a"
},
plugins: [
  new ExtractTextPlugin({
    filename:  (getPath) => {
      return getPath('css/[name].css').replace('css/js', 'css');
    },
    allChunks: true
  })
]
```

#### webpack.HotModuleReplacementPlugin

```javascript
new webpack.HotModuleReplacementPlugin({
  // Options...
})
```

> 大部分情况不需要配置 new webpack.HotModuleReplacementPlugin() is Enough!

> ```javascript
> Options: {
>  multiStep: //If true, the plugin will build in two steps -- first compiling the hot update chunks, and then the remaining normal assets.
>
>  fullBuildTimeout: (number)//The delay between the two steps when multiStep is enabled.
>
>  requestTimeout:(number) //The timeout used for manifest download (since webpack 3.0.0)
> }
> ```

#### clean-webpack-plugin

在开发过程中，编译的过程会持续的进行，当我们更改了某些依赖或者增删某些代码后，我们的`dist`输出目录会变得杂乱，但是 webpack 无法追踪到哪些文件是实际在项目中用到的。

通常，在每次构建前清理 `/dist` 文件夹，是比较推荐的做法，因此只会生成用到的文件。让我们完成这个需求。

[`clean-webpack-plugin`](https://www.npmjs.com/package/clean-webpack-plugin) 是一个比较普及的管理插件，让我们安装和配置下。

```bash
npm install clean-webpack-plugin --save-dev
```

```javascript
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
+ const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    plugins: [
+     new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Output Management'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

> 现在执行 `npm run build`，再检查 `/dist` 文件夹。如果一切顺利，你现在应该不会再看到旧的文件，只有构建后生成的文件！

#### webpack-manifest-plugin

```bash
npm install --save-dev webpack-manifest-plugin
```

```javascript
var ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
    // ...
    plugins: [
      new ManifestPlugin()
    ]
};
```

配置：

```javascript
new ManifestPlugin({
  fileName: 'my-manifest.json',
  basePath: '/app/'
  seed: {
    name: 'My Manifest'
  }
})
```

`bathPath`: A path prefix for all keys. Useful for including your output path in the manifest.

`publicPath`: A path prefix used only on output files, similar to Webpack's [output.publicPath](https://github.com/webpack/docs/wiki/configuration#outputpublicpath).
`stripSrc`:  Removes unwanted strings from source filenames.
`seed`:  A cache of key/value pairs to used to seed the manifest. This may include a set of [custom key/value](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json) pairs to include in your manifest, or may be used to combine manifests across compilations in [multi-compiler mode](https://github.com/webpack/webpack/tree/master/examples/multi-compiler). To combine manifests, pass a shared seed object to each compiler's ManifestPlugin instance.

[更多配置…](https://github.com/danethurber/webpack-manifest-plugin)

#### webpack.optimize.UglifyJsPlugin

用于压缩js文件。此插件支持所有的 [UglifyJS 选项](https://github.com/mishoo/UglifyJS2#usage)

#### webpack.DefinePlugin

设置编译时的NodeJs环境变量。

```javascript
// webpack.config.js
const webpack = require('webpack');

module.exports = {
  /*...*/
  plugins:[
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};
```


###  配置文件的多种配置类型

- 最简配置

```javascript
var path = require('path');

module.exports = {
  entry: './foo.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  }
};
```

- 用—env 导出对象采用函数形式，接受环境参数

  > 最终，你会发现需要在[开发](https://doc.webpack-china.org/guides/development)和[生产构建](https://doc.webpack-china.org/guides/production)之间，消除 `webpack.config.js` 的差异。（至少）有两种选项：
  >
  > 作为导出一个配置对象的替代，你可以返回一个函数，此函数接受 environment 作为参数。当运行 webpack 时，你可以通过 `--env` 指定构建环境的键，例如 `--env.production` 或者 `--env.platform=web`。

  ```javascript
  module.exports = function(env) {
    return {
      plugins: [
       new webpack.optimize.UglifyJsPlugin({
         compress: env.production // 只在生产环境构建时压缩
        })
      ]
    };
  };
  ```

- 导出Promise

> webpack 将运行由配置文件导出的函数，并且等待 Promise 返回。便于需要异步地加载所需的配置变量。

```javascript
module.exports = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        entry: './app.js',
        /* ... */
      })
    }, 5000)
  })
}
```

- 导出多个配置对象

> 作为导出一个配置对象/配置函数的替代，你可能需要导出多个配置对象（从 webpack 3.1.0 开始支持导出多个函数）。当运行 webpack 时，所有的配置对象都会构建。例如，导出多个配置对象，对于针对多个[构建目标](https://doc.webpack-china.org/configuration/output#output-librarytarget)（例如 AMD 和 CommonJS）[打包一个 library](https://doc.webpack-china.org/guides/author-libraries) 非常有用。

```javascript
module.exports = [{
  output: {
    filename: './dist-amd.js',
    libraryTarget: 'amd'
  },
  entry: './app.js',
}, {
  output: {
    filename: './dist-commonjs.js',
    libraryTarget: 'commonjs'
  },
  entry: './app.js',
}]
```

### Runtime 和 Manifest

在使用 webpack 构建的典型应用程序或站点中，有三种主要的代码类型：

1. 你或你的团队编写的源码。
2. 你的源码会依赖的任何第三方的 library 或 "vendor" 代码。
3. webpack 的 runtime 和 *manifest*，管理所有模块的交互。

本文将重点介绍这三个部分中的最后部分，runtime 和 manifest。

#### Runtime

如上所述，我们这里只简略地介绍一下。runtime，以及伴随的 manifest 数据，主要是指：在浏览器运行时，webpack 用来连接模块化的应用程序的所有代码。runtime 包含：在模块交互时，连接模块所需的加载和解析逻辑。包括浏览器中的已加载模块的连接，以及懒加载模块的执行逻辑。

#### Manifest

> 你可能会感兴趣，webpack及其插件似乎“知道”应该哪些文件生成。答案是，通过 manifest，webpack 能够对「你的模块映射到输出 bundle 的过程」保持追踪。如果你对通过其他方式来管理 webpack 的[输出](https://doc.webpack-china.org/configuration/output)更感兴趣，那么首先了解 manifest 是个好的开始。
>
> 通过使用 [`WebpackManifestPlugin`](https://github.com/danethurber/webpack-manifest-plugin)，可以直接将数据提取到一个 json 文件，以供使用。

一旦你的应用程序中，形如 `index.html` 文件、一些 bundle 和各种资源加载到浏览器中，会发生什么？你精心安排的 `/src` 目录的文件结构现在已经不存在，所以 webpack 如何管理所有模块之间的交互呢？这就是 manifest 数据用途的由来……

#### 问题

所以，现在你应该对 webpack 在幕后工作有一点了解。“但是，这对我有什么影响呢？”，你可能会问。答案是大多数情况下没有。runtime 做自己该做的，使用 manifest 来执行其操作，然后，一旦你的应用程序加载到浏览器中，所有内容将展现出魔幻般运行。然而，如果你决定通过使用浏览器缓存来改善项目的性能，理解这一过程将突然变得尤为重要。

通过使用 bundle 计算出内容散列(content hash)作为文件名称，这样在内容或文件修改时，浏览器中将通过新的内容散列指向新的文件，从而使缓存无效。一旦你开始这样做，你会立即注意到一些有趣的行为。即使表面上某些内容没有修改，计算出的哈希还是会改变。这是因为，runtime 和 manifest 的注入在每次构建都会发生变化。

查看*管理构建文件*指南的 [manifest 部分](https://doc.webpack-china.org/guides/output-management#the-manifest)，了解如何提取 manifest，并阅读下面的指南，以了解更多长效缓存错综复杂之处。

### 生产环境的配置

#### 最简单的方式：

定义两个完全独立的配置文件，就像这样

```javascript
// webpack.dev.js
module.exports = {
  devtool: 'cheap-module-source-map',

  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: '[name].bundle.js',
    publicPath: publicPath,
    sourceMapFilename: '[name].map'
  },

  devServer: {
    port: 7777,
    host: 'localhost',
    historyApiFallback: true,
    noInfo: false,
    stats: 'minimal',
    publicPath: publicPath
  }
}
```

```javascript
// webpack.prod.js
module.exports = {
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: '[name].bundle.js',
    publicPath: publicPath,
    sourceMapFilename: '[name].map'
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    })
  ]
}
```

```javascript
// webpack.config.js
module.exports = function(env) {
  return require(`./webpack.${env}.js`)
}
```

```json
//package.json
"scripts": {
  ...
  "build:dev": "webpack --env=dev --progress --profile --colors",
  "build:dist": "webpack --env=prod --progress --profile --colors"
}
```

#### 更高级的方式：

一个更复杂的方法是，有一个基本配置文件，其中包含两个环境通用的配置，然后将其与特定于环境的配置进行合并。这将为每个环境产生完整配置，并防止重复公共部分代码。

用于执行此"合并"工作的工具简称为 [webpack-merge](https://github.com/survivejs/webpack-merge)，提供了各种合并选项，但下面我们只使用最简单的版本。

```javascript
// webpack.common.js
module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'main': './src/main.ts'
  },

  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: '[name].bundle.js',
    publicPath: publicPath,
    sourceMapFilename: '[name].map'
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [path.join(__dirname, 'src'), 'node_modules']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/\.(spec|e2e)\.ts$/],
        use: [
          'awesome-typescript-loader',
          'angular2-template-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader']
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: 'file-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000
          }
        }
      }
    ]
  },

  plugins: [
    new ForkCheckerPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['polyfills', 'vendor'].reverse()
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunksSortMode: 'dependency'
    })
  ]
}
```

然后，使用 `webpack-merge`，把通用配置和环境特定配置合并在一起。让我们看一个合并生产环境文件的简单示例：

```javascript
// webpack.prod.js
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');

module.exports = Merge(CommonConfig, {
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    })
  ]
})
```

> 你将会注意到 'webpack.prod.js' 文件的三点主要变化：
>
> - 使用 `webpack-merge` 合并'webpack.common.js'。
> - 我们把 `output` 属性放到 `webpack.common.js` 文件中，因为它是所有环境通用的。
> - 我们只在 `webpack.prod.js` 中使用 `DefinePlugin`，并把 `'process.env.NODE_ENV'` 定义为 `'production'`。



### 参考资料

- [Webpack中文](https://doc.webpack-china.org/)
- [入门 Webpack，看这篇就够了](https://segmentfault.com/a/1190000006178770)
- [Plugins List](https://doc.webpack-china.org/plugins/)
- [Loaders List](https://doc.webpack-china.org/loaders/)
- [webpack & HTTP/2](https://medium.com/webpack/webpack-http-2-7083ec3f3ce6)
- [The Fine Art of the Webpack 3 Config](https://blog.flennik.com/the-fine-art-of-the-webpack-2-config-dc4d19d7f172)