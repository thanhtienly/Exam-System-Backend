import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthController } from './controllers/auth.controller';
import { CypherService } from './services/cypher.service';
import { ProducerService } from 'src/rabbitmq/producer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConsumerController } from 'src/rabbitmq/consumer.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './services/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    ClientsModule.register([
      {
        name: 'RMQ_USER_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
          ],
          queue: 'user-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFETIME },
    }),
  ],
  providers: [UserService, CypherService, ProducerService, RedisService],
  controllers: [AuthController, ConsumerController],
})
export class UserModule {}
