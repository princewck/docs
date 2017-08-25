## Webpack checksheet

[TOC]

### 入门

> #### 什么是Webpack
> WebPack可以看做是模块打包机：它做的事情是，分析你的项目结构，找到JavaScript模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其转换和打包为合适的格式供浏览器使用。
> #### WebPack和Grunt以及Gulp相比有什么特性
> 其实Webpack和另外两个并没有太多的可比性，Gulp/Grunt是一种能够优化前端的开发流程的工具，而WebPack是一种模块化的解决方案，不过Webpack的优点使得Webpack在很多场景下可以替代Gulp/Grunt类的工具。

> gulp/grunt 工作方式：
> ![gulp/grunt 工作方式：](asserts/gulp.png)
> webpack 工作方式：
> ![webpack.png](asserts/webpack.png)

1. ####sourceMap配置
  配置devtool选项：

| value                        | Description                              |
| :--------------------------- | ---------------------------------------- |
| source-map                   | 在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的source map，但是它会减慢打包速度 |
| cheap-module-source-map      | 在一个单独的文件中生成一个不带列映射的map，不带列映射提高了打包速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号），会对调试造成不便； |
| eval-source-map              | 使用eval打包源文件模块，在同一个文件中生成干净的完整的source map。这个选项可以在不影响构建速度的前提下生成完整的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项，在生产阶段则一定不要启用这个选项； |
| cheap-module-eval-source-map | 这是在打包文件时最快的生成source map的方法，生成的Source Map 会和打包后的JavaScript文件同行显示，没有列映射，和eval-source-map选项具有相似的缺点； |

> 常用： eval-source-map

2. #### dev-server 本地开发服务器配置

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

   ​

> 使用NodeJs API 方式时此配置将被忽略，NodeJs API 方式使用devServer的例子：
>
> [https://webpack.js.org/configuration/dev-server/#devserver](https://webpack.js.org/configuration/dev-server/#devserver)
>
> [https://github.com/webpack/webpack-dev-server/blob/master/examples/node-api-simple/server.js](https://github.com/webpack/webpack-dev-server/blob/master/examples/node-api-simple/server.js)

### 模块(module) 配置

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



####CSS预处理器

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

### 参考资料

[入门 Webpack，看这篇就够了](https://segmentfault.com/a/1190000006178770)