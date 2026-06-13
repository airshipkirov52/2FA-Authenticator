import { useRef, useState } from "react";

import OtpAuthUtils from "@/common/OtpAuthUtils";
import type { OtpInstance } from "./Types";
import QrScanner from "qr-scanner";

const QRCodeForm = (props: {
  onCloseModal: () => void;
  fetchOtpInstances: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const saveScanQrCode = async (result: QrScanner.ScanResult) => {
    const otpInstance: OtpInstance = OtpAuthUtils.toOtpInstance(result.data);
    const optInstances = await OtpAuthUtils.findAllOtpInstances();
    await chrome.storage.local.set({
      [OtpAuthUtils.OTP_INSTANCE_STORAGE_KEY]: [otpInstance, ...optInstances],
    });
    props.fetchOtpInstances();
    props.onCloseModal();
  }

  const handleScanQrCode = (file: File) => {
    QrScanner.scanImage(file, { returnDetailedScanResult: true })
      .then(async (result) => {
        await saveScanQrCode(result);
        setScanError(null);
      })
      .catch(error => setScanError(error));
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    handleScanQrCode(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleScanQrCode(file);
  };

  return (<div className="flex justify-center py-4">
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`
          w-full h-52 p-4 rounded-2xl border-2 border-dashed
          flex items-center justify-center
          cursor-pointer overflow-hidden transition bg-white
          ${dragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:bg-gray-50"}
        `}
    >
      <div className="flex flex-col text-center">
        <p className="text-lg font-medium">
          Drop QR code image here
        </p>
        <span>or</span>
        <button
          onClick={() => inputRef.current?.click()}
          className="btn bg-blue-500 hover:bg-blue-600 text-white mt-1">
          Click to upload
        </button>
        {scanError && <p className="text-red-500">{scanError}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFile}
      />
    </div>
  </div>
  );
};

export default QRCodeForm;