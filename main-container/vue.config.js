
const port = 6650; // dev port
let styleVariables = require('./src/style/variables.scss.js');

module.exports = {
  // publicPath: './',
  devServer: {
    // host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: Object.keys(styleVariables)
          .map(k => `\$${k.replace('_', '-')}: ${styleVariables[k]};`)
          .join('\n')
      }
    }
  }
};
