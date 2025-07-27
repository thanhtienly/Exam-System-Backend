export class VerifyAccountMailData {
  email: string;
  firstName: string;
  lastName: string;
  verifyAccountURL: string;
}

export class ForgotPasswordMailData {
  email: string;
  firstName: string;
  lastName: string;
  otp: string;
}
