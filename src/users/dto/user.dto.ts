import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class SignUpDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    new RegExp(
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
    ),
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class VerifyAccountPayload {
  email: string;
  firstName: string;
  lastName: string;
}

export class SignInDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ForgotPasswordDTO {
  @IsString()
  @IsEmail()
  email: string;
}

export class ValidateOtpDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Matches(new RegExp('^[0-9]{6}$'))
  otp: string;
}

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    new RegExp(
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
    ),
  )
  newPassword: string;
}

export class ResetPasswordPayload {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class ChangePasswordDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    new RegExp(
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
    ),
  )
  newPassword: string;
}

export class RenewTokenDTO {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
