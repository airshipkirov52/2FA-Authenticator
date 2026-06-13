export interface OtpInstance {
  id: string;
  type: "TOTP" | "HOTP";
  accountName: string;
  secretKey: string;
  issuer?: string;
  digits?: number;
  period?: number;
  counter?: number;
  algorithm?: string;
}