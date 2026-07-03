import { useRef, useState } from "react";

import OtpAuthUtils from "@/common/OtpAuthUtils";
import { OtpInstance } from "../Types";
import SecurityForm from "./SecurityForm";

const Settings = (props: {
  fetchOtpInstances: () => void;
}) => {
  const importRef = useRef<HTMLInputElement>(null);
  const [securityFormOpen, setSecurityFormOpen] = useState(false);

  const exportOtpAccounts = async () => {
    const oldOptInstances = await OtpAuthUtils.findAllOtpInstances();
    const otpLinks = oldOptInstances
      .map((otpInstance) => OtpAuthUtils.toOtpLink(otpInstance))
      .filter((otpLink) => otpLink)
      .join("\n");
    const blob = new Blob([otpLinks], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const formattedDate = new Date()
      .toISOString()
      .replace(/-/g, "")
      .replace("T", "_")
      .replace(/:/g, "")
      .replace(/\.\d{3}Z$/, "");
    link.download = `otp-backup-${formattedDate}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const importOtpAccounts = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!window.confirm("Are you sure you want to import this file?, this will overwrite your current accounts")) return;
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      if (!text) {
        alert("File is empty!");
        return;
      }
      const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
      const otpInstances: OtpInstance[] = [];
      for (const line of lines) {
        if (!OtpAuthUtils.validateOtpLink(line)) continue;
        const otpInstance: OtpInstance = OtpAuthUtils.toOtpInstance(line);
        otpInstances.push(otpInstance);
      }
      await chrome.storage.local.set({ [OtpAuthUtils.OTP_INSTANCE_STORAGE_KEY]: otpInstances });
      await props.fetchOtpInstances();
      alert("Accounts imported successfully!");
      window.close();
    } finally {
      event.target.value = "";
    }
  }

  const openWindowMode = () => {
    chrome.runtime.sendMessage({
      type: "OPEN_WINDOW"
    });
  }

  return (<>
    <div className="drawer drawer-end">
      <input id="Settings" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="Settings" className="drawer-button">
          <span className="cursor-pointer text-neutral-500 active:text-neutral-400 text-lg" title="Settings">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em">
              <path xmlns="http://www.w3.org/2000/svg" d="M255.1 512c-56.05 0-75.99-11.33-75.99-35.94V436.5c-15.17-6.375-29.35-14.53-42.36-24.41l-34.3 19.78c-4.621 2.703-9.976 4.013-15.36 4.013c-36.71 0-76.25-92.87-76.25-108.6c0-10.85 5.806-21.34 15.71-27.07l34.17-19.72C60.52 272.1 59.99 264 59.99 255.1s.5313-16.13 1.625-24.47L27.42 211.8C17.53 206.1 11.73 195.6 11.73 184.7c0-12.58 37.98-108.7 76.2-108.7c5.417 0 10.82 1.338 15.52 4.111L137.6 99.88C150.6 90.01 164.8 81.85 179.1 75.47V35.91C179.1 4.335 215.7 0 256 0c39.71 0 75.1 4.083 75.1 35.91v39.56c15.17 6.375 29.35 14.53 42.36 24.41l34.3-19.78c4.621-2.703 9.981-4.013 15.37-4.013c36.47 0 76.24 92.55 76.24 108.6c0 10.85-5.806 21.34-15.71 27.07l-34.17 19.72c1.094 8.344 1.625 16.44 1.625 24.47s-.5313 16.13-1.625 24.47l34.19 19.75c9.895 5.703 15.7 16.19 15.7 27.05c0 12.59-37.98 108.7-76.21 108.7c-5.42 0-10.83-1.338-15.51-4.111l-34.19-19.72c-13.02 9.876-27.19 18.03-42.36 24.41v39.56C332 500.6 312.1 512 255.1 512zM140.9 373.2c35.92 30.82 52.34 34.36 71.05 41v61.85c14.11 2.344 28.82 3.727 43.76 3.727c14.95 0 30.13-1.383 45.19-4.571l-.9532-61c16.07-5.702 35.18-10.22 71.05-41l53.61 30.97c18.78-22.06 33.77-47.97 43.39-76.57l-52.94-30.56c2.745-14.99 4.859-25.43 4.859-39.07c0-10.95-1.364-23.97-4.859-43.06l53.46-30.85c-9.829-27.75-24.92-53.97-45.1-76.72l-52.43 31.41c-35.92-30.82-52.34-34.36-71.05-41V35.91c-14.11-2.344-28.82-3.727-43.76-3.727c-14.95 0-30.13 1.383-45.19 4.571l.9532 61C195.9 103.5 176.8 107.1 140.9 138.8L87.33 107.8c-18.99 22.31-34.08 48.53-43.69 77.47l53.24 29.66C94.14 229.9 92.02 240.4 92.02 253.1c0 10.95 1.364 23.97 4.859 43.06l-53.46 30.85c9.829 27.75 24.92 53.97 45.1 76.72L140.9 373.2zM256 351.1c-52.94 0-96-43.06-96-96S203.1 159.1 256 159.1s96 43.06 96 96S308.9 351.1 256 351.1zM256 191.1c-35.3 0-64 28.72-64 64S220.7 319.1 256 319.1s64-28.72 64-64S291.3 191.1 256 191.1z" />
            </svg>
          </span>
        </label>
      </div>
      <div className="drawer-side z-20">
        <label htmlFor="Settings" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="min-h-full w-full bg-base-100">
          <div className="relative px-4 py-1 border-b border-gray-300 h-10">
            <label htmlFor="Settings" className="drawer-button">
              <span className="absolute top-2 left-4 cursor-pointer text-neutral-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1.5em" height="1.5em">
                  <path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z" />
                </svg>
              </span>
            </label>
            <h3 className="text-xl text-center font-semibold">Setting</h3>
          </div>
          <div className="flex flex-col gap-2 h-[calc(100vh-40px)] overflow-y-auto px-4 py-3">
            <div className="flex gap-3 mb-2">
              <button onClick={exportOtpAccounts} className="btn flex-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em">
                  <path xmlns="http://www.w3.org/2000/svg" d="M224 352c4.094 0 8.188-1.562 11.31-4.688l144-144c6.25-6.25 6.25-16.38 0-22.62s-16.38-6.25-22.62 0L240 297.4V16C240 7.156 232.8 0 224 0S208 7.156 208 16v281.4L91.31 180.7c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62l144 144C215.8 350.4 219.9 352 224 352zM448 432v-96c0-8.844-7.156-16-16-16S416 327.2 416 336v96c0 26.47-21.53 48-48 48h-288C53.53 480 32 458.5 32 432v-96C32 327.2 24.84 320 16 320S0 327.2 0 336v96C0 476.1 35.88 512 80 512h288C412.1 512 448 476.1 448 432z" />
                </svg>
                <span>Export</span>
              </button>
              <input ref={importRef} type="file" onChange={importOtpAccounts} className="hidden" />
              <button onClick={() => importRef.current?.click()} className="btn flex-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em">
                  <path xmlns="http://www.w3.org/2000/svg" d="M212.7 4.688l-144 144c-6.25 6.25-6.25 16.38 0 22.62s16.38 6.25 22.62 0L208 54.63V336c0 8.844 7.156 16 16 16s16-7.156 16-16V54.63l116.7 116.7c6.25 6.25 16.38 6.25 22.62 0s6.25-16.38 0-22.62l-144-144C232.2 1.562 228.1 0 224 0S215.8 1.562 212.7 4.688zM416 336v96c0 26.47-21.53 48-48 48h-288C53.53 480 32 458.5 32 432v-96C32 327.2 24.84 320 16 320S0 327.2 0 336v96C0 476.1 35.88 512 80 512h288c44.13 0 80-35.88 80-80v-96c0-8.844-7.156-16-16-16S416 327.2 416 336z" />
                </svg>
                <span>Import</span>
              </button>
            </div>
            <div className="flex gap-3 mb-2">
              <button onClick={() => setSecurityFormOpen(true)} className="btn flex-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em">
                  <path xmlns="http://www.w3.org/2000/svg" d="M384 223.1l-32 0V127.1c0-70.59-57.41-127.1-128-127.1S96 57.41 96 127.1v95.1L64 223.1c-35.35 0-64 28.65-64 64v160c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64v-160C448 252.7 419.3 223.1 384 223.1zM128 128c0-52.94 43.06-96 96-96s96 43.06 96 96v96H128V128zM416 448c0 17.64-14.36 32-32 32H64c-17.64 0-32-14.36-32-32V288c0-17.64 14.36-32 32-32h320c17.64 0 32 14.36 32 32V448z" />
                </svg>
                <span>Security</span>
              </button>
              <button onClick={() => openWindowMode()} className="btn flex-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em">
                  <path d="M416 416h-160v-16C256 391.2 248.8 384 240 384S224 391.2 224 399.1V432C224 440.8 231.2 448 240 448h192c8.837 0 16-7.163 16-16v-192C448 231.2 440.8 224 432 224h-32C391.2 224 384 231.2 384 239.1S391.2 256 399.1 256H416V416zM352 288V64c0-35.35-28.65-64-64-64H64C28.65 0 0 28.65 0 64v224c0 35.35 28.65 64 64 64h224C323.3 352 352 323.3 352 288zM32 288V64c0-17.67 14.33-32 32-32h224c17.67 0 32 14.33 32 32v224c0 17.67-14.33 32-32 32H64C46.33 320 32 305.7 32 288zM448 160h-48C391.2 160 384 167.2 384 175.1S391.2 192 399.1 192H448c17.67 0 32 14.33 32 32v224c0 17.67-14.33 32-32 32H224c-17.67 0-32-14.33-32-32v-48C192 391.2 184.8 384 176 384S160 391.2 160 399.1V448c0 35.35 28.65 64 64 64h224c35.35 0 64-28.65 64-64V224C512 188.7 483.3 160 448 160z" />
                </svg>
                <span>Window Mode</span>
              </button>
            </div>
            <p className="mt-auto p-3 text-center">
              Version: {chrome.runtime.getManifest().version}
            </p>
          </div>
        </div>
      </div>
    </div>
    <SecurityForm
      open={securityFormOpen}
      onCloseModal={() => setSecurityFormOpen(false)}
    />
  </>);
}

export default Settings;