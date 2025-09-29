import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { error } from "console";
import { channel } from "diagnostics_channel";
import Redis from "ioredis";

type MessageHandler = (channel:string,message:string) => void;

@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisPubSubService.name);
    private Publisher: Redis;
    private Subscriber: Redis;
    private MessageHandlers: Map<string, Set<MessageHandler>> = new Map()

    constructor(private readonly config: ConfigService) {}

    onModuleInit() {
        const redisURL = this.config.get<string>('REDIS_URL');

        if(!redisURL){
            throw new error('REDIS_URL is not defined in the Configuration');
        }

        this.Publisher = new Redis(redisURL);
        this.Subscriber = new Redis(redisURL);

        this.Subscriber.on('messgae', (channel:string,message:string) => {
            const handlers = this.MessageHandlers.get(channel);

            if(handlers){

            handlers.forEach((handler)=>{
                try {
                    handler(channel,message);
                } catch (error) {
                    this.logger.error("Error in Message Handler for channel",channel,error);
                }
            })
            }else{
                this.logger.warn("There are no handlers for the channel",channel);
            }

        })

        this.logger.log("Redis Pub/Sub Initialized");
    }

    onModuleDestroy() {
        this.Publisher?.quit();
        this.Subscriber?.quit();
    }

    async publish(channel:string, message:string): Promise<void> {
        try {
            const messageStr = typeof message=== 'string' ? message : JSON.stringify(message);
            await this.Publisher.publish(channel,messageStr);
            this.logger.debug("Published Message to channel",channel);
        } catch (error) {
            this.logger.error("Error Publishing Message to channel",channel,error);
        }
    }
}