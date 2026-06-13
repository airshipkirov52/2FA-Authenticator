import * as OTPAuth from "otpauth";

import { OtpInstance } from "@/components/Types";
import { v4 as uuidv4 } from "uuid";

const OTP_INSTANCE_STORAGE_KEY = "otpAccounts";

const validateOtpLink = (link: string) => {
  try {
    const url = new URL(link);
    if (url.protocol !== "otpauth:") {
      return false;
    }
    const type = url.hostname;
    if (!["totp", "hotp"].includes(type)) {
      return false;
    }
    const secret = url.searchParams.get("secret");
    if (!secret) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

const toOtpInstance = (uri: string) => {
  const parsed = OTPAuth.URI.parse(uri);
  const isTotp = parsed instanceof OTPAuth.TOTP;
  const type = isTotp ? "TOTP" : "HOTP";
  const otpInstance: OtpInstance = {
    id: uuidv4(),
    type,
    accountName: parsed.label,
    issuer: parsed.issuer || "",
    secretKey: parsed.secret.base32,
    digits: parsed.digits,
    algorithm: parsed.algorithm,
    period: isTotp ? (parsed as OTPAuth.TOTP).period : 30,
    counter: !isTotp ? (parsed as OTPAuth.HOTP).counter : undefined,
  };
  return otpInstance;
};

const toOtpLink = (otpInstance: OtpInstance) => {
  if (!otpInstance || !otpInstance.secretKey) return;
  return `otpauth://${otpInstance.type.toLowerCase()}/${otpInstance.issuer ? `${otpInstance.issuer}` : "unknown"}:${otpInstance.accountName}?secret=${otpInstance.secretKey}&issuer=${otpInstance.issuer}`;
}

const findAllOtpInstances = async () => {
  const storage = await chrome.storage.local.get(OTP_INSTANCE_STORAGE_KEY);
  const optInstances = (storage[OTP_INSTANCE_STORAGE_KEY] as OtpInstance[]) ?? [];
  return optInstances;
}

const OtpAuthUtils = {
  validateOtpLink,
  toOtpInstance,
  toOtpLink,
  findAllOtpInstances,
  OTP_INSTANCE_STORAGE_KEY,
};

export default OtpAuthUtils;