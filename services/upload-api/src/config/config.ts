import {processEnvValidator} from '@try-catch-f1nally/express-microservice';
import Config, {EnvVars} from './types/config.interface';

const envVars = processEnvValidator<EnvVars>({
  type: 'object',
  properties: {
    PORT: {type: 'integer', default: 3000},
    AUTH_PUBLIC_KEY: {type: 'string'},
    FRONTEND_ORIGIN: {type: 'string'},
    STORAGE_API_ORIGIN: {type: 'string'},
    REDIS_HOST: {type: 'string', format: 'hostname'},
    REDIS_PORT: {type: 'integer', default: 6379},
    LOGSTASH_HOST: {type: 'string', format: 'hostname'},
    LOGSTASH_PORT: {type: 'integer', default: 8080},
    KAFKA_HOST: {type: 'string', format: 'hostname'},
    KAFKA_PORT: {type: 'integer', default: 9092}
  },
  required: ['AUTH_PUBLIC_KEY', 'FRONTEND_ORIGIN', 'REDIS_HOST']
});

export const config: Config = {
  port: envVars.PORT,
  auth: {
    publicKey: envVars.AUTH_PUBLIC_KEY
  },
  redis: {
    connectionOptions: {
      host: envVars.REDIS_HOST,
      port: envVars.REDIS_PORT
    }
  },
  kafka: {
    connectionOptions: {
      clientId: 'upload-api',
      brokers: [`${envVars.KAFKA_HOST}:${envVars.KAFKA_PORT}`]
    }
  },
  'storage-api': {
    url: envVars.STORAGE_API_ORIGIN
  },
  upload: {
    path: './uploads',
    fileSizeLimit: 2 * 1024 * 1024 * 1024
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
        application: 'upload-api'
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
