module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
    outputDir:"../server/src/main/resources/static"
}