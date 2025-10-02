export const SERVICES = {
  AUTH_SERVICE: 'AUTH_SERVICE',
  USER_SERVICE: 'USER_SERVICE',
  LOAN_SERVICE:'LOAN_SERVICE',
  MONEY_SERVICE: 'MONEY_SERVICE',
  API_GATEWAY_SERVICE: 'API_GATEWAY_SERVICE',
} as const;

export const TCP_PATTERN = {
  // Auth Service
  AUTH_LOGIN: 'auth.login',
  AUTH_REGISTER: 'auth.register',
  AUTH_VERFIY_TOKEN: 'auth.verify-token',
  AUTH_REFRESH_TOKEN: 'auth.refresh-token',
  AUTH_LOGOUT: 'auth.logout',

  //User Service
  USER_CREATE: 'user.create',
  USER_FIND_BY_ID: 'user.findById',
  USER_FIND_BY_EMAIL: 'user.findByEmail',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_LIST: 'user.list',

  // API Gateway
  API_GATEWAY_GET_STATS: 'api-gateway.getStats',
  API_GATEWAY_HEALTH_CHECK: 'api-gateway.healthCheck',
};

export const REDIS_KEYS = {
  USER_PROFILE: 'user:profile:',
  USER_SESSION: 'user:session:',
  AUTH_TOKEN: 'auth:token:',
  CACHE_INVALIDATION: 'cache:invalidation:',
  PUB_SUB: {
    USER_UPDATED: 'user:updated',
    USER_DELETED: 'user:deleted',
    AUTH_LOGIN: 'auth:login',
    AUTH_LOGOUT: 'auth:logout',
  },
} as const;

export const CACHE_PREFIXES = {
  USER: 'user:',
  AUTH: 'auth:',
  SESSION: 'session:',
} as const;