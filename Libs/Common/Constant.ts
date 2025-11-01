export const SERVICES = {
  AUTH_SERVICE: 'AUTH_SERVICE',
  USER_SERVICE: 'USER_SERVICE',
  LOAN_SERVICE: 'LOAN_SERVICE',
  MONEY_SERVICE: 'MONEY_SERVICE',
  MINI_ANGELS_BACKEND: 'MINI_ANGELS_BACKEND',
} as const;

export const TCP_PATTERNS = {
  // SME Auth Service
  SME_AUTH_LOGIN: 'sme.auth.login',
  SME_AUTH_REGISTER: 'sme.auth.register',
  SME_AUTH_VERFIY_TOKEN: 'sme.auth.verify-token',
  SME_AUTH_REFRESH_TOKEN: 'sme.auth.refresh-token',
  SME_AUTH_LOGOUT: 'sme.auth.logout',

  // Invester Auth Service
  INVESETER_AUTH_LOGIN: 'invester.auth.login',
  INVESETER_AUTH_REGISTER: 'invester.auth.register',
  INVESETER_AUTH_VERFIY_TOKEN: 'invester.auth.verify-token',
  INVESETER_AUTH_REFRESH_TOKEN: 'invester.auth.refresh-token',
  INVESETER_AUTH_LOGOUT: 'invester.auth.logout',

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
