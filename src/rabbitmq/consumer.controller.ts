import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import {
  ForgotPasswordMailData,
  VerifyAccountMailData,
} from 'src/users/dto/queue.dto';

@Controller()
export class ConsumerController {
  @EventPattern('verify-account')
  async handleVerifyAccountMessage(data: VerifyAccountMailData) {
    console.log('Received message:', data);
  }

  @EventPattern('forgot-password')
  async handleForgotPasswordMessage(data: ForgotPasswordMailData) {
    console.log('Received message:', data);
  }
}
