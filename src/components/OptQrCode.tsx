import * as OTPAuth from "otpauth";

import { useEffect, useState } from "react"

import type { OtpInstance } from "./Types"
import QRCode from "qrcode";

const OtpQrCode = (props: {
  open: boolean;
  otpInstance: OtpInstance;
  onCloseModal: () => void;
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  useEffect(() => {
    let otpInstance:
      | OTPAuth.TOTP
      | OTPAuth.HOTP
      | undefined;

    if (props.otpInstance.type === "TOTP") {
      otpInstance = new OTPAuth.TOTP({
        secret: props.otpInstance.secretKey,
        issuer: props.otpInstance.issuer,
        algorithm: props.otpInstance.algorithm || "SHA1",
        digits: props.otpInstance.digits || 6,
        period: props.otpInstance.period || 30,
      });
    }

    if (props.otpInstance.type === "HOTP") {
      otpInstance = new OTPAuth.HOTP({
        secret: props.otpInstance.secretKey,
        issuer: props.otpInstance.issuer,
        algorithm: props.otpInstance.algorithm || "SHA1",
        digits: props.otpInstance.digits || 6,
        counter: props.otpInstance.counter || 0,
      });
    }
    const otpAuthUrl = otpInstance?.toString() || "";
    generateQrCodeDataUrl(otpAuthUrl);
  }, [props.otpInstance]);

  const generateQrCodeDataUrl = async (otpAuthUrl: string) => {
    const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl);
    setQrCodeDataUrl(qrCodeUrl);
  };

  if (!props.open) return null;

  return (
    <div onClick={props.onCloseModal} className="fixed inset-0 z-50 flex justify-center items-center bg-black/20">
      <div className="max-w-sm bg-gray-200 rounded">
        <img src={qrCodeDataUrl} alt="OTP QR Code" className="w-full h-full" />
      </div>
    </div>
  );
};

export default OtpQrCode;