
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Collaborative Workspace API',
    version: '1.0.0'
  }
}
module.exports = { swaggerUi, swaggerSpec }
