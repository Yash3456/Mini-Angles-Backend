import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      await this.redisClient.connect();
      this.logger.log('Connected to Redis Successfully');
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      this.logger.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttlseconds?: number): Promise<void> {
    try {
      if (ttlseconds) {
        await this.redisClient.setex(key, ttlseconds, value);
      } else {
        await this.redisClient.set(key, value);
      }
    } catch (error) {
      this.logger.error(`Redis SET error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      this.logger.error(`Redis DEL error for key ${key}:`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redisClient.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redisClient.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      this.logger.error(`Redis GET JSON error for key ${key}:`, error);
      return null;
    }
  }

  async setJson(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.set(key, jsonValue, ttlSeconds);
    } catch (error) {
      this.logger.error(`Redis SET JSON error for key ${key}:`, error);
    }
  }

  async hget(key: string, field: string): Promise<string | null> {
    try {
      return await this.redisClient.hget(key, field);
    } catch (error) {
      this.logger.error(
        `Redis HGET error for key ${key} and field ${field}:`,
        error,
      );
      return null;
    }
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    try {
      await this.redisClient.hset(key, field, value);
    } catch (error) {
      this.logger.error(
        `Redis HSET error for key ${key} and field ${field}:`,
        error,
      );
    }
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    try {
      return await this.redisClient.hgetall(key);
    } catch (error) {
      this.logger.error(`Redis HGETALL error for key ${key}:`, error);
      return {};
    }
  }

  async lpush(key: string, ...values: string[]): Promise<void> {
    try {
      await this.redisClient.lpush(key, ...values);
    } catch (error) {
      this.logger.error(`Redis LPUSH error for key ${key}:`, error);
    }
  }

  async rpop(key: string): Promise<string | null> {
    try {
      return await this.redisClient.rpop(key);
    } catch (error) {
      this.logger.error(`Redis RPOP error for key ${key}:`, error);
      return null;
    }
  }

  async sadd(key: string, ...members: string[]): Promise<void> {
    try {
      await this.redisClient.sadd(key, ...members);
    } catch (error) {
      this.logger.error(`Redis SADD error for key ${key}:`, error);
    }
  }

  async smembers(key: string): Promise<string[]> {
    try {
      return await this.redisClient.smembers(key);
    } catch (error) {
      this.logger.error(`Redis SMEMBERS error for key ${key}:`, error);
      return [];
    }
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    try {
      await this.redisClient.expire(key, ttlSeconds);
    } catch (error) {
      this.logger.error(`Redis EXPIRE error for key ${key}:`, error);
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.redisClient.ttl(key);
    } catch (error) {
      this.logger.error(`Redis TTL error for key ${key}:`, error);
      return -1;
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.redisClient.keys(pattern);
    } catch (error) {
      this.logger.error(`Redis KEYS error for pattern ${pattern}:`, error);
      return [];
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.keys(pattern);
      if (keys.length > 0) {
        await this.redisClient.del(...keys);
      }
    } catch (error) {
      this.logger.error(
        `Redis DELETE PATTERN error for pattern ${pattern}:`,
        error,
      );
    }
  }

  async ping(): Promise<boolean> {
    try {
      const result = await this.redisClient.ping();
      return result === 'PONG';
    } catch (error) {
      this.logger.error('Redis PING error:', error);
      return false;
    }
  }

  async cacheGet<T>(key: string): Promise<T | null> {
    return this.getJson<T>(key);
  }

  async cacheSet<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const defaultTtl = this.config.get<number>('CACHE_TTL', 300);
    return this.setJson(key, value, ttlSeconds || defaultTtl);
  }

  async cacheInvalidate(pattern: string): Promise<void> {
    await this.deletePattern(pattern);
  }
}
