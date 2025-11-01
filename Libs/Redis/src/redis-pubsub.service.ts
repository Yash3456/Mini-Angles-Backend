import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';
import { channel } from 'diagnostics_channel';
import { promises } from 'dns';
import Redis from 'ioredis';
import { timestamp } from 'rxjs';

type MessageHandler = (channel: string, message: string) => void;

@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisPubSubService.name);
  private Publisher: Redis;
  private Subscriber: Redis;
  private MessageHandlers: Map<string, Set<MessageHandler>> = new Map();

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const redisURL = this.config.get<string>('REDIS_URL');

    if (!redisURL) {
      throw new Error('REDIS_URL is not defined in the Configuration');
    }

    this.Publisher = new Redis(redisURL);
    this.Subscriber = new Redis(redisURL);

    this.Subscriber.on('messgae', (channel: string, message: string) => {
      const handlers = this.MessageHandlers.get(channel);

      if (handlers) {
        handlers.forEach((handler) => {
          try {
            handler(channel, message);
          } catch (error) {
            this.logger.error(
              'Error in Message Handler for channel',
              channel,
              error,
            );
          }
        });
      } else {
        this.logger.warn('There are no handlers for the channel', channel);
      }
    });

    this.logger.log('Redis Pub/Sub Initialized');
  }

  onModuleDestroy() {
    this.Publisher?.quit();
    this.Subscriber?.quit();
  }

  async publish(channel: string, message: string): Promise<void> {
    try {
      const messageStr =
        typeof message === 'string' ? message : JSON.stringify(message);
      await this.Publisher.publish(channel, messageStr);
      this.logger.debug('Published Message to channel', channel);
    } catch (error) {
      this.logger.error('Error Publishing Message to channel', channel, error);
    }
  }

  async subscribe(channel: string, handler: MessageHandler): Promise<void> {
    try {
      if (!this.MessageHandlers.has(channel)) {
        this.MessageHandlers.set(channel, new Set());
        await this.Subscriber.subscribe(channel);
        this.logger.log('Susbscribed to the channel', channel);
      } else {
        this.logger.log('Already Subscribed to the Channel', channel);
      }

      this.MessageHandlers.get(channel)?.add(handler);
    } catch (error) {
      this.logger.error(
        'Error occured while subscribing to the Channel',
        channel,
        error,
      );
    }
  }

  async unsubscribe(channel: string, handler?: MessageHandler): Promise<void> {
    try {
      const handlers = this.MessageHandlers.get(channel);

      if (!handler) return;

      handlers?.delete(handler);

      if (handlers?.size === 0) {
        this.MessageHandlers.delete(channel);
        await this.Subscriber.unsubscribe(channel);
        this.logger.log('Unsusbscribed from the Channel');
      } else {
        this.logger.log(
          'Handler unsubscribed from the channel but there are still the handlers of size',
          handlers?.size,
        );
      }
    } catch (error) {
      this.logger.error('Failed to Unsubscribe the channel', channel, error);
    }
  }

  async publishJSON(channel: string, data: any): Promise<void> {
    await this.publish(channel, JSON.stringify(data));
  }

  async subscribeJSON<T>(
    channel: string,
    handler: (channel: string, data: T) => void,
  ): Promise<void> {
    await this.subscribe(channel, (chan: string, message: string) => {
      try {
        const data = JSON.parse(message);
        handler(channel, data as T);
      } catch (error) {
        this.logger.error(
          'Error parsing the JSON Message from the channel',
          channel,
        );
        return;
      }
    });
  }

  async publishUserEvent(
    event: string,
    userId: string,
    data?: { email: string; name: string },
  ): Promise<void> {
    await this.publishJSON(`user:${event}`, {
      userId,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  async publishAuthEvent(
    event: string,
    userId: string,
    data?: any,
  ): Promise<void> {
    await this.publishJSON(`auth:${event}`, {
      userId,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  async publicCacheInvalidation(pattern: string): Promise<void> {
    await this.publishJSON(`cacheInvalidation`, {
      pattern,
      timestamp: new Date().toISOString(),
    });
  }
}
