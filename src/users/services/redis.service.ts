import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'ioredis';

export class RedisService {
  private readonly redisClient: Redis.Redis;
  constructor(
    @Inject()
    private configService: ConfigService,
  ) {
    this.redisClient = new Redis.Redis({
      host: this.configService.get('REDIS_HOST'),
      port: parseInt(this.configService.get('REDIS_PORT') || '6379'),
    });
  }

  getClient(): Redis.Redis {
    return this.redisClient;
  }
}
