import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { RedisService } from "./redis.service";
import { RedisPubSubService } from "./redis-pubsub.service";

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService): Redis => {
        const redisURL = configService.get<string>('REDIS_URL');
        
        if (redisURL) {
          return new Redis(redisURL, {
            maxRetriesPerRequest: 3,
            lazyConnect: true,
            connectTimeout: 10000,
            commandTimeout: 5000,
            tls: redisURL.startsWith('rediss://') ? {} : undefined,
            retryStrategy: (times) => Math.min(times * 50, 2000),
            family: 4
          });
        } else {
          return new Redis({
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
            password: configService.get<string>('REDIS_PASSWORD'),
            db: configService.get<number>('REDIS_DB', 0),
            maxRetriesPerRequest: 3,
            lazyConnect: true,
            connectTimeout: 10000,
            commandTimeout: 5000,
            retryStrategy: (times) => Math.min(times * 50, 2000),
            family: 4,
          });
        }
      },
      inject: [ConfigService],
    },
    RedisService,
    RedisPubSubService
  ],
  exports: ['REDIS_CLIENT', RedisPubSubService, RedisService],
})
export class RedisModule {}