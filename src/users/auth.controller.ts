import { Body, Controller, Post, Query, Res } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ChangePasswordDTO,
  ForgotPasswordDTO,
  RenewTokenDTO,
  ResetPasswordDTO,
  ResetPasswordPayload,
  SignInDTO,
  SignUpDTO,
  ValidateOtpDTO,
  VerifyAccountPayload,
} from './dto/user.dto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { CypherService } from './cypher.service';
import { ConfigService } from '@nestjs/config';
import { ProducerService } from 'src/rabbitmq/producer.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from './redis.service';
import * as speakeasy from 'speakeasy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly cypherService: CypherService,
    private readonly configService: ConfigService,
    private readonly producerService: ProducerService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() signUpData: SignUpDTO, @Res() res: Response) {
    let user = await this.userService.findByEmail(signUpData.email);

    if (user != null) {
      return res.status(400).json({
        success: false,
        message: 'Email have been used',
      });
    }

    const hashPassword = await bcrypt.hash(signUpData.password, 10);
    signUpData.password = hashPassword;

    user = await this.userService.create(signUpData);
    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const encrypted = this.cypherService.encryptData(JSON.stringify(payload));
    const verifyAccountURL = `${this.configService.get('FRONTEND_HOST')}/verify-account?token=${encrypted}`;

    this.producerService.emitToVerifyAccount({
      ...payload,
      verifyAccountURL: verifyAccountURL,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  @Post('verify-account')
  async verifyAccount(@Query('token') token: string, @Res() res: Response) {
    try {
      const userData = this.cypherService.decryptData(token);
      var payload: VerifyAccountPayload = JSON.parse(userData);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token',
      });
    }

    var user = await this.userService.findByEmail(payload.email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isVerify) {
      return res.status(200).json({
        success: true,
        data: user,
      });
    }

    user.isVerify = true;
    user.verifiedAt = new Date();

    user = await this.userService.update(user);

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  @Post('sign-in')
  async signIn(@Body() signInData: SignInDTO, @Res() res: Response) {
    var user = await this.userService.findByEmail(signInData.email);

    if (user == null) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.isVerify) {
      return res.status(403).json({
        success: false,
        message: 'Account is not verify',
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      signInData.password,
      user.password,
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Password is not match',
      });
    }

    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    var accessToken = this.jwtService.sign(payload);
    var refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_LIFETIME'),
    });

    res.status(200).json({
      success: true,
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordData: ForgotPasswordDTO,
    @Res() res: Response,
  ) {
    let user = await this.userService.findByEmail(forgotPasswordData.email);

    if (!user) {
      return res.status(200).json({
        success: true,
        data: {},
      });
    }

    const otpSecret = this.cypherService.encryptData(user.id);

    const otpLifeTime = parseInt(this.configService.get('OTP_STEP') || '300');
    var otpBlockTime = parseInt(
      this.configService.get('OTP_BLOCK_TIME') || '1800',
    );

    const otp = speakeasy.totp({
      secret: otpSecret,
      digits: parseInt(this.configService.get('OTP_LENGTH') || '6'),
      encoding: 'base32',
      step: otpLifeTime,
    });

    await this.redisService
      .getClient()
      .setex(`userId:${user.id}:otp:${otp}`, otpLifeTime, 1);

    var isRetryKeyExist = await this.redisService
      .getClient()
      .get(`userId:${user.id}:otp:retry`);

    if (!isRetryKeyExist) {
      await this.redisService
        .getClient()
        .setex(`userId:${user.id}:otp:retry`, otpBlockTime, 0);
    }

    this.producerService.emitToForgotPassword({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      otp: otp,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  @Post('validate-otp')
  async validateOTP(
    @Body() validateOtpData: ValidateOtpDTO,
    @Res() res: Response,
  ) {
    var otpRetryTimes = parseInt(
      (await this.redisService
        .getClient()
        .get(`userId:${validateOtpData.userId}:otp:retry`)) || '0',
    );

    /* Check if otp retry limit exceeded */
    if (otpRetryTimes > 3) {
      return res.status(400).json({
        success: false,
        message: 'OTP retry limit exceeded',
      });
    }

    var isValidOtp = await this.redisService
      .getClient()
      .get(`userId:${validateOtpData.userId}:otp:${validateOtpData.otp}`);

    /* Check if OTP is valid */
    if (!isValidOtp) {
      var otpBlockTime = parseInt(
        this.configService.get('OTP_BLOCK_TIME') || '1800',
      );
      otpRetryTimes += 1;

      await this.redisService
        .getClient()
        .setex(
          `userId:${validateOtpData.userId}:otp:retry`,
          otpBlockTime,
          otpRetryTimes,
        );

      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    await this.redisService
      .getClient()
      .del(`userId:${validateOtpData.userId}:otp:${validateOtpData.otp}`);

    await this.redisService
      .getClient()
      .del(`userId:${validateOtpData.userId}:otp:retry`);

    var payload = {
      userId: validateOtpData.userId,
    };
    var token = this.cypherService.encryptData(JSON.stringify(payload));

    return res.status(200).json({
      success: true,
      data: {
        token: token,
      },
    });
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordData: ResetPasswordDTO,
    @Res() res: Response,
  ) {
    try {
      const data = this.cypherService.decryptData(resetPasswordData.token);
      var payload: ResetPasswordPayload = JSON.parse(data);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token',
      });
    }

    const user = await this.userService.findById(payload.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.password = await bcrypt.hash(resetPasswordData.newPassword, 10);

    await this.userService.update(user);

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  @Post('change-password')
  async changePassword(
    @Body() changePasswordData: ChangePasswordDTO,
    @Res() res: Response,
  ) {
    let user = await this.userService.findByEmail(changePasswordData.email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      changePasswordData.oldPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Password is not match',
      });
    }

    user.password = await bcrypt.hash(changePasswordData.newPassword, 10);

    user = await this.userService.update(user);

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  @Post('renew-access-token')
  renewAccessToken(
    @Body() renewTokenData: RenewTokenDTO,
    @Res() res: Response,
  ) {
    try {
      var payload = this.jwtService.verify(renewTokenData.refreshToken, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      });
      delete payload.iat;
      delete payload.exp;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    var accessToken = this.jwtService.sign(payload);
    var refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_LIFETIME'),
    });

    res.status(200).json({
      success: true,
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  }
}
