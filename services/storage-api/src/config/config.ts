import {processEnvValidator} from '@try-catch-f1nally/express-microservice';
import Config, {EnvVars} from './types/config.interface';

const envVars = processEnvValidator<EnvVars>({
  type: 'object',
  properties: {
    PORT: {type: 'integer', default: 3000},
    MONGODB_HOST: {type: 'string', format: 'hostname'},
    MONGODB_PORT: {type: 'integer', default: 27017},
    LOGSTASH_HOST: {type: 'string', format: 'hostname'},
    LOGSTASH_PORT: {type: 'integer', default: 8080},
    KAFKA_HOST: {type: 'string', format: 'hostname'},
    KAFKA_PORT: {type: 'integer', default: 9092},
    AUTH_PUBLIC_KEY: {type: 'string'},
    FRONTEND_ORIGIN: {type: 'string'}
  },
  required: ['MONGODB_HOST', 'AUTH_PUBLIC_KEY', 'FRONTEND_ORIGIN']
});

export const config: Config = {
  port: envVars.PORT,
  mongodb: {
    uri: `mongodb://${envVars.MONGODB_HOST}:${envVars.MONGODB_PORT}/storage-api`
  },
  kafka: {
    connectionOptions: {
      clientId: 'storage-api',
      brokers: [`${envVars.KAFKA_HOST}:${envVars.KAFKA_PORT}`]
    }
  },
  auth: {
    publicKey: envVars.AUTH_PUBLIC_KEY
  },
  storage: {
    path: './archives'
  },
  cors: {
    origin: envVars.FRONTEND_ORIGIN,
    credentials: true
  },
  log4js: {
    appenders: {
      all: {
        type: 'stdout'
      },
      logstash: {
        type: '@log4js-node/logstash-http',
        url: `http://${envVars.LOGSTASH_HOST}:${envVars.LOGSTASH_PORT}/_bulk`,
        application: 'storage-api'
      }
    },
    categories: {
      default: {
        appenders: ['all', 'logstash'],
        level: 'all'
      }
    }
  }
};
