import { useEffect, useState } from "react";

import Home from "@/components/Home";
import OtpAuthUtils from "@/common/OtpAuthUtils";
import { OtpInstance } from "@/components/Types";
import SecurityValidation from "@/components/SecurityValidation";
import Settings from "@/components/settings/Settings";

export default function App() {
  const [otpInstances, setOtpInstances] = useState<OtpInstance[]>([]);
  const [isValidPassword, setValidPassword] = useState(false);
  const [requiredPassword, setRequiredPassword] = useState({
    locked: false,
    hasSecurity: false
  });
  const [openAddOtpAuth, setOpenAddOtpAuth] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["locked", "securityHash"]).then(({ locked, securityHash }) => {
      setRequiredPassword({ locked: Boolean(locked), hasSecurity: !!securityHash });
    });
  }, []);

  const fetchOtpInstances = (keyword: string = "") => {
    chrome.storage.local.get(OtpAuthUtils.OTP_INSTANCE_STORAGE_KEY).then(storage => {
      const data = (storage[OtpAuthUtils.OTP_INSTANCE_STORAGE_KEY] as OtpInstance[]) ?? [];
      const filtered = data.filter(({ accountName, issuer }) => {
        return accountName.toLowerCase().includes(keyword) || issuer?.toLowerCase().includes(keyword)
      })
      setOtpInstances(filtered);
    });
  }

  const handleStartCropQrCode = () => {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (!tab?.id) return;
      chrome.tabs.sendMessage(tab.id, { type: "START_CROP_QRCODE" });
    });
  }

  const handleLock = async (locked: boolean) => {
    await chrome.storage.local.set({ locked });
    setRequiredPassword(prev => ({ ...prev, locked }));
  }

  const handleValidatePassword = (isValidPassword: boolean) => {
    setValidPassword(isValidPassword);
  }

  if (requiredPassword.hasSecurity && requiredPassword.locked && !isValidPassword) {
    return (<SecurityValidation onValidatePassword={handleValidatePassword} />);
  }

  return (<>
    <header className="flex justify-between items-center bg-white border-b border-gray-200 h-10 px-4">
      <h1 className="flex justify-start items-center gap-2 text-xl flex-1 w-72">
        <img src="/32.png" className="w-6 h-6" alt="Vite logo" />
        <span className="font-semibold">2FA Authenticator</span>
      </h1>
      <div className="flex items-center gap-3">
        {requiredPassword.hasSecurity && (<>
          {requiredPassword.locked && (<span onClick={() => handleLock(false)} className="cursor-pointer text-neutral-500 active:text-neutral-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em">
              <path d="M384 223.1L368 224V144c0-79.41-64.59-144-144-144S80 64.59 80 144V224L64 223.1c-35.35 0-64 28.65-64 64v160c0 35.34 28.65 64 64 64h320c35.35 0 64-28.66 64-64v-160C448 252.7 419.3 223.1 384 223.1zM144 144C144 99.88 179.9 64 224 64s80 35.88 80 80V224h-160V144z" />
            </svg>
          </span>)}
          {!requiredPassword.locked && (<span onClick={() => handleLock(true)} className="cursor-pointer text-neutral-500 active:text-neutral-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em">
              <path xmlns="http://www.w3.org/2000/svg" d="M448 288v160C448 483.3 419.3 512 384 512H64c-35.35 0-64-28.66-64-63.1v-160c0-35.35 28.65-64 64-64L80 224V144C80 64.59 144.6 0 224 0s144 64.59 144 144V160h-64V144C304 99.88 268.1 64 224 64S144 99.88 144 144V224L384 224C419.3 224 448 252.7 448 288z" />
            </svg>
          </span>)}
        </>)}
        <span onClick={handleStartCropQrCode} className="cursor-pointer text-neutral-500 active:text-neutral-400 text-lg" title="Scan QR">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em">
            <path xmlns="http://www.w3.org/2000/svg" d="M144 32h-128C7.156 32 0 39.16 0 48v128C0 184.8 7.156 192 16 192S32 184.8 32 176V64h112C152.8 64 160 56.84 160 48S152.8 32 144 32zM144 448H32v-112C32 327.2 24.84 320 16 320S0 327.2 0 336v128C0 472.8 7.156 480 16 480h128C152.8 480 160 472.8 160 464S152.8 448 144 448zM432 320c-8.844 0-16 7.156-16 16V448h-112c-8.844 0-16 7.156-16 16s7.156 16 16 16h128c8.844 0 16-7.156 16-16v-128C448 327.2 440.8 320 432 320zM432 32h-128C295.2 32 288 39.16 288 48S295.2 64 304 64H416v112C416 184.8 423.2 192 432 192S448 184.8 448 176v-128C448 39.16 440.8 32 432 32z" />
          </svg>
        </span>
        <span onClick={() => setOpenAddOtpAuth(true)} className="cursor-pointer text-neutral-500 active:text-neutral-400 text-lg" title="Add">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em">
            <path xmlns="http://www.w3.org/2000/svg" d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
          </svg>
        </span>
        <Settings fetchOtpInstances={fetchOtpInstances} />
      </div>
    </header>
    <Home
      openAddOtpAuth={openAddOtpAuth}
      otpInstances={otpInstances}
      fetchOtpInstances={fetchOtpInstances}
      setOtpInstances={setOtpInstances}
      onCloseAddOtpAuth={() => setOpenAddOtpAuth(false)}
    />
  </>);
}
