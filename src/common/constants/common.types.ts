enum DB {
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_NAME = 'DB_NAME',
  DB_MASTER_HOST = 'DB_MASTER_HOST',
  DB_SLAVE_HOST = 'DB_SLAVE_HOST',
  HARD_CODE_SCHEMA = 'HARD_CODE_SCHEMA',
}

export const ConfigServiceKeys = {
  PORT: 'PORT',
  JWT_SECRET: 'JWT_SECRET',
  DOMAIN: 'DOMAIN',
  ENTERPRISE_NAME: 'ENTERPRISE_NAME',
  ...DB,
} as const;

export type ConfigServiceType = typeof ConfigServiceKeys;