module.exports = function(env) {
  process.env.NODE_ENV = env === 'prod' && 'production'
  return require(`./config/webpack.${env}.js`)
}