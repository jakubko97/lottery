const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || 0
const webpack = require('webpack')

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
   configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('src'),
        'vue$': 'vue/dist/vue.esm.js'
      },
      modules: [resolve('node_modules')]
    },
    resolveLoader: {
      modules: [resolve('node_modules')]
  },
      module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: 'babel-loader',
            }
        ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: '"' + version + '"'
        }
      })
    ]
  }
}
