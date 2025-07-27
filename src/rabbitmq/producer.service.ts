import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ForgotPasswordMailData,
  VerifyAccountMailData,
} from 'src/users/dto/queue.dto';

@Injectable()
export class ProducerService {
  constructor(
    @Inject('RMQ_USER_QUEUE')
    private readonly userQueueClient: ClientProxy,
  ) {}

  async emitToVerifyAccount(data: VerifyAccountMailData) {
    return this.userQueueClient.emit('verify-account', data).subscribe();
  }

  async emitToForgotPassword(data: ForgotPasswordMailData) {
    return this.userQueueClient.emit('forgot-password', data).subscribe();
  }
}
