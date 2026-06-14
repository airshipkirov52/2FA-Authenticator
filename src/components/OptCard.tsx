import * as OTPAuth from "otpauth";

import { useEffect, useState } from "react";

import OptQrCode from "./OptQrCode";
import Otp from "./Opt";
import OtpAuthUtils from "@/common/OtpAuthUtils";
import type { OtpInstance } from "./Types";
import UpdateOtpAuth from "./UpdateOtpAuth";

const OptCard = (props: {
  otpInstance: OtpInstance;
  isEdit?: boolean;
  fetchOtpInstances: () => void;
}) => {
  const radius = 18;
  const period = props.otpInstance.period || 30;
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openQrCode, setOpenQrCode] = useState(false);
  const [token, setToken] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    generate();
    const interval = setInterval(() => generate(), 100);
    return () => clearInterval(interval);
  }, []);

  const onRemove = () => {
    if (!window.confirm("Are you sure you want to remove this account?")) return;
    chrome.storage.local.get(OtpAuthUtils.OTP_INSTANCE_STORAGE_KEY).then(storage => {
      const data = (storage[OtpAuthUtils.OTP_INSTANCE_STORAGE_KEY] as OtpInstance[]) ?? [];
      const updated = data.filter(({ id }) => id !== props.otpInstance.id);
      chrome.storage.local.set({ [OtpAuthUtils.OTP_INSTANCE_STORAGE_KEY]: updated });
      props.fetchOtpInstances();
    });
  }

  const generate = async () => {
    let totp = new OTPAuth.TOTP({
      secret: props.otpInstance.secretKey,
      issuer: props.otpInstance.issuer,
      algorithm: props.otpInstance.algorithm || "SHA1",
      digits: props.otpInstance.digits || 6,
      period: props.otpInstance.period || 30
    });
    setToken(totp.generate());
    const remaining = totp.remaining();
    setRemaining(remaining);
    setCountdown(Math.floor(remaining / 1000));
  }

  const isExpiredSoon = countdown <= 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (remaining / (period * 1000)) * circumference;

  return (<>
    <div className="card bg-base-100 card-md shadow-sm my-2 mx-4">
      <div className="card-body p-3 relative group">
        <div className="hidden group-hover:flex gap-2 absolute -top-1 -right-1 z-10 border rounded-full p-0.5">
          <button className="swap cursor-grab text-neutral-400 active:text-neutral-300 text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width=".8em" height=".8em">
              <path xmlns="http://www.w3.org/2000/svg" d="M224 352c-4.094 0-8.188 1.562-11.31 4.688L144 425.4V48C144 39.16 136.8 32 128 32S112 39.16 112 48v377.4l-68.69-68.69c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62l96 96c6.25 6.25 16.38 6.25 22.62 0l96-96c6.25-6.25 6.25-16.38 0-22.62C232.2 353.6 228.1 352 224 352zM427.3 132.7l-96-96c-6.25-6.25-16.38-6.25-22.62 0l-96 96c-6.25 6.25-6.25 16.38 0 22.62s16.38 6.25 22.62 0L304 86.63V464c0 8.844 7.156 16 16 16s16-7.156 16-16V86.63l68.69 68.69C407.8 158.4 411.9 160 416 160s8.188-1.562 11.31-4.688C433.6 149.1 433.6 138.9 427.3 132.7z" />
            </svg>
          </button>
        </div>
        <h3 className="text-sm font-semibold min-h-5" title={props.otpInstance.accountName}>
          {props.otpInstance.issuer ? `${props.otpInstance.issuer}: ` : "Unknown: "}
          {props.otpInstance.accountName}
        </h3>
        <div className="relative flex justify-between">
          <div className="hidden group-hover:flex gap-2 absolute top-1/2 -translate-y-1/2 right-12 z-10">
            <button onClick={() => setOpenQrCode(true)} className="cursor-pointer text-neutral-400 active:text-neutral-300 text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width=".8em" height=".8em">
                <path d="M108 360h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12v-24C120 365.4 114.6 360 108 360zM108 104h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12v-24C120 109.4 114.6 104 108 104zM144 288h-96C21.49 288 0 309.5 0 336v96C0 458.5 21.49 480 48 480h96C170.5 480 192 458.5 192 432v-96C192 309.5 170.5 288 144 288zM160 432C160 440.8 152.8 448 144 448h-96C39.16 448 32 440.8 32 432v-96C32 327.2 39.16 320 48 320h96C152.8 320 160 327.2 160 336V432zM144 32h-96C21.49 32 0 53.49 0 80v96C0 202.5 21.49 224 48 224h96C170.5 224 192 202.5 192 176v-96C192 53.49 170.5 32 144 32zM160 176C160 184.8 152.8 192 144 192h-96C39.16 192 32 184.8 32 176v-96C32 71.16 39.16 64 48 64h96C152.8 64 160 71.16 160 80V176zM364 104h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12v-24C376 109.4 370.6 104 364 104zM400 32h-96C277.5 32 256 53.49 256 80v96C256 202.5 277.5 224 304 224h96C426.5 224 448 202.5 448 176v-96C448 53.49 426.5 32 400 32zM416 176C416 184.8 408.8 192 400 192h-96C295.2 192 288 184.8 288 176v-96C288 71.16 295.2 64 304 64h96C408.8 64 416 71.16 416 80V176zM432 288C423.2 288 416 295.2 416 304v64h-64v-64C352 295.2 344.8 288 336 288h-64C263.2 288 256 295.2 256 304v160c0 8.844 7.156 16 16 16s16-7.156 16-16V320h32v64c0 8.844 7.156 16 16 16h96c8.844 0 16-7.156 16-16V304C448 295.2 440.8 288 432 288zM436 432h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24C442.6 480 448 474.6 448 468v-24C448 437.4 442.6 432 436 432zM372 432h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24C378.6 480 384 474.6 384 468v-24C384 437.4 378.6 432 372 432z" />
              </svg>
            </button>
            <button onClick={() => setOpenUpdate(true)} className="cursor-pointer text-neutral-400 active:text-neutral-300 text-lg" title="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width=".8em" height=".8em">
                <path d="M493.2 56.26l-37.51-37.51C443.2 6.252 426.8 0 410.5 0c-16.38 0-32.76 6.25-45.26 18.75L31.04 352.1c-2.234 2.234-3.756 5.078-4.377 8.176l-26.34 131.7C-1.703 502.1 6.156 512 15.95 512c1.049 0 2.117-.1035 3.199-.3203l131.7-26.34c3.098-.6191 5.941-2.141 8.176-4.373L493.3 146.7C518.3 121.7 518.2 81.26 493.2 56.26zM112 317.2l203.3-203.3l82.76 82.76L194.7 400H112V317.2zM139.8 454.9l-103.4 20.69l20.68-103.4L80 349.2V432h82.74L139.8 454.9zM470.7 124l-49.1 50l-82.76-82.76l49.91-49.91C393.9 35.33 401.9 32 410.5 32s16.58 3.328 22.62 9.373L470.6 78.89C483.1 91.36 483.1 111.6 470.7 124z" />
              </svg>
            </button>
            <button onClick={onRemove} className="cursor-pointer text-neutral-400 active:text-neutral-300 text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width=".8em" height=".8em">
                <path xmlns="http://www.w3.org/2000/svg" d="M400.8 128c-8.284 0-15.2 6.324-15.94 14.58L356 465.4C355.4 473.6 348.4 480 340.1 480H107.9C99.63 480 92.63 473.6 92 465.4L63.16 142.6C62.42 134.3 55.51 128 47.23 128C37.83 128 30.45 136.1 31.29 145.4l28.84 322.8C62.38 493 83 512 107.9 512h232.3c24.88 0 45.5-19 47.75-43.75l28.84-322.8C417.5 136.1 410.2 128 400.8 128zM432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.2 64 0 71.2 0 80s7.2 16 16 16h416c8.8 0 16-7.2 16-16S440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152z" />
              </svg>
            </button>
          </div>
          <Otp value={token} isExpiredSoon={isExpiredSoon}>{token.slice(0, 3)} {token.slice(3)}</Otp>
          <div className="relative flex justify-end items-center gap-1.5 w-1/3">
            <svg width="40" height="40">
              <circle
                cx="20"
                cy="20"
                r={radius}
                fill="none"
                stroke="#d1d5dc"
                strokeWidth="3"
              />
              <circle
                cx="20"
                cy="20"
                r={radius}
                stroke={isExpiredSoon ? "#f87171" : "#0000009c"}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={-offset}
                transform="rotate(-90 20 20)"
              />
              <text x="20" y="22" textAnchor="middle" dominantBaseline="middle" style={{
                fontSize: "11px",
                fontWeight: 600
              }}>
                {countdown}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <UpdateOtpAuth
      open={openUpdate}
      onCloseModal={() => setOpenUpdate(false)}
      otpInstance={props.otpInstance}
      fetchOtpInstances={props.fetchOtpInstances}
    />
    <OptQrCode
      open={openQrCode}
      otpInstance={props.otpInstance}
      onCloseModal={() => setOpenQrCode(false)}
    />
  </>);
}

export default OptCard