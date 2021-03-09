const UglifyPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    // 基本路径
    publicPath: './',
    // 输出文件目录
    outputDir: 'dist',
    // webpack-dev-server 相关配置
    devServer: {
        port: 8080,
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.mode = 'production'
            // 将每个依赖包打包成单独的js文件
            let optimization = {
                minimizer: [new UglifyPlugin({
                    uglifyOptions: {
                        warnings: false,
                        compress: {
                            drop_console: true, // console
                            drop_debugger: false,
                            pure_funcs: ['console.log'] // 移除console
                        }
                    }
                })]
            }
            Object.assign(config, {
                optimization
            })
        } else {
            // 为开发环境修改配置...
            config.mode = 'development'
        }
    }
}