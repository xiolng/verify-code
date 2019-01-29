const path = require('path')
const webpack = require('webpack')
const resolve = dir => {
    return path.join(__dirname, dir)
}

module.exports = {
    lintOnSave: true,
    configureWebpack: {
        plugins: [
            // new webpack.ProvidePlugin({
            //   $: 'jquery',
            //   jquery: 'jquery',
            //   jQuery: 'jquery',
            //   'window.jQuery': 'jquery'
            // })
        ]
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
        config.devtool = 'inline-source-map'
    },
    // 打包时不生成.map文件
    productionSourceMap: false,
    // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
    devServer: {
        host: '0.0.0.0',
        port: '8084',
        disableHostCheck: false,
        proxy: {
            '/api': {
                target: 'http://172.16.2.54:8082',
                pathRewrite: {
                  '^/api': '/api'
                }
            }
        }
    }
}
