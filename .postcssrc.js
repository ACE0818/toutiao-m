module.exports = {
  plugins: {
    // 'autoprefixer': {
    //     browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    'postcss-pxtorem': {
      // rootValue: 37.5,
      // rootValue: 75,
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      propList: ['*'],
      // 配置不做单位转换的资源文件名
      exclude: 'github-markdown'
    }
  }
}
