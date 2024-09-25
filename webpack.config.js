module.exports = {
  output: {
    //[chunkhash:8] 设置文件摘要，用于缓存
    filename: '[name].[chunkhash:8].bundle.js', //entry 对用生成文件的文件名规则
    chunkFilename : '[name].[chunkhash:8].js',  //不是entry定义的文件(分离打包的模块文件，提取的共同文件)，对用生成文件的文件名规则
    path: TARGET,
    publicPath: '/public/'
  },
  plugins: [
    //...
    //...
    //** 设置打包id生成规则，以文件地址 + hash 形式，是生成的  webpack 模块id固定，参见参考文献
    new webpack.HashedModuleIdsPlugin(),
    //提取的共同文件插件配置
    new webpack.optimize.CommonsChunkPlugin({
        //在模块中如果存在的功用的话，也进行提取设置
        //如moduleA，moduleB 中都用了编辑器，entry中没有，则会抽出公用打包在一个  数字.hash.js 中
        async: true, 
        minChunks: 2 //有2处使用的js文件就提取
    }), 
    //vendor: entry文件中用到的共用文件打包在vendor文件
    //** manifest: 增加这个配置，则把一个加载的id信息统一到一个文件，这样就可以实现每次打包未改的文件生成的hash不变，参见参考文献
    new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
    }),
    //对应的 chunks 加上 'manifest', 'vendor'
    new HtmlWebpackPlugin({
        filename: `${page.name}.html`,
        template: `${ROOT_PATH}/template.ejs`,
        chunks: ['manifest', 'vendor', page.name]
    })
  ],
  module: {
    rules: [{
            test: /\.router\.jsx/,
            loader: [
                //根据文件后缀.router.jsx 设置规则，主要是name 和 regExp 的实现，这个可以查看bundle-loader源代码就能发现相关的支持
                //现在的逻辑是取文件名，/router/moduleA.router.jsx 则打包成 moduleA.hash.js
                'bundle-loader?lazy&name=[1]&regExp=([^\\\\\\/]*)\\.router\\.jsx',
                'babel-loader',
            ],
            exclude: /node_modules|assets/
        }, {
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules|assets/
        }
    ]
  },
}
