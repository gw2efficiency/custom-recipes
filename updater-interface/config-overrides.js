const rewireReactHotLoader = require('react-app-rewire-hot-loader')
const {injectBabelPlugin} = require('react-app-rewired')

module.exports = function override (config, env) {
  // @decorators for MobX
  config = injectBabelPlugin('transform-decorators-legacy', config)

  // Hot reloading :fire:
  config = rewireReactHotLoader(config, env)

  return config
}
