enum DB {
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_NAME = 'DB_NAME',
  HARD_CODE_SCHEMA = 'HARD_CODE_SCHEMA',
}

export const ConfigServiceKeys = {
  PORT: 'PORT',
  JWT_SECRET: 'JWT_SECRET',
  ...DB,
} as const;

export type ConfigServiceType = typeof ConfigServiceKeys;