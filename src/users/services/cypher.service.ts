import { ConfigService } from '@nestjs/config';
import { VerifyAccountPayload } from 'src/users/dto/user.dto';
import {
  createCipheriv,
  randomBytes,
  createDecipheriv,
  createHash,
} from 'crypto';
import { Inject } from '@nestjs/common';

export class CypherService {
  constructor(
    @Inject()
    private configService: ConfigService,
  ) {}

  encryptData(payload: string) {
    let key = this.configService.get('ENCRYPTION_KEY');
    const alg = this.configService.get('ENCRYPTION_ALG');
    const ivLength = parseInt(this.configService.get('IV_LENGTH') || '12');

    key = createHash('sha256')
      .update(String(key))
      .digest('base64')
      .substring(0, 32);

    const iv = randomBytes(ivLength);
    const cipher = createCipheriv(alg, key, iv);
    let cipherBuffer = cipher.update(payload, 'binary');
    cipher.final();
    let authTag = cipher.getAuthTag();

    let encrypted = Buffer.concat([iv, cipherBuffer, authTag]).toString('hex');
    return encrypted;
  }

  decryptData = (data: string) => {
    let key = this.configService.get('ENCRYPTION_KEY');
    const alg = this.configService.get('ENCRYPTION_ALG');
    const ivLength = parseInt(this.configService.get('IV_LENGTH') || '12');

    key = createHash('sha256')
      .update(String(key))
      .digest('base64')
      .substring(0, 32);

    try {
      var bufferData = Buffer.from(data, 'hex');
      var ivPart = bufferData.slice(0, ivLength);
      /* Auth Tag Buffer length is 16 */
      var authTagPart = bufferData.slice(bufferData.length - 16);
      var cipherBufferPart = bufferData.slice(ivLength, bufferData.length - 16);
    } catch (error) {
      throw new Error('Invalid Token');
    }

    const decipher = createDecipheriv(alg, key, ivPart).setAuthTag(authTagPart);
    const result = decipher.update(cipherBufferPart).toString('utf-8');
    decipher.final();

    return result;
  };
}
