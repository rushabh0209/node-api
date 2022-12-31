import config from 'config/app-config';

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'API documentation',
    version: '1.0.0'
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`
    }
  ]
};

export default swaggerDef;
