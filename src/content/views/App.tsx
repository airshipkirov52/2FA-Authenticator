import { useEffect, useRef } from "react";

import OtpAuthUtils from "@/common/OtpAuthUtils";
import { OtpInstance } from "@/components/Types";
import QrScanner from "qr-scanner";

function App() {
  const selection = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selection.current) return;
    const container = document.getElementById("crxjs-app");
    if (!container) return;

    let startX = 0;
    let startY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startY = e.clientY;

      const mousemove = (event: MouseEvent) => {
        const currentX = event.clientX;
        const currentY = event.clientY;

        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);
        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);

        if (selection.current) {
          selection.current.style.top = `${top}px`;
          selection.current.style.left = `${left}px`;
          selection.current.style.width = `${width}px`;
          selection.current.style.height = `${height}px`;
        }
      };

      const mouseup = async () => {
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);

        if (!selection.current) return;
        const rect = selection.current.getBoundingClientRect();

        if (rect.width < 5 || rect.height < 5) return;
        const screenshot = await chrome.runtime.sendMessage({
          type: "CAPTURE_SCREEN",
        });

        if (!screenshot) {
          console.error("Cannot get screenshot.");
          return;
        }

        const croped = new Image();
        croped.src = screenshot;
        croped.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const scale = window.devicePixelRatio || 1;
          const x = rect.left * scale;
          const y = rect.top * scale;
          const width = rect.width * scale;
          const height = rect.height * scale;

          canvas.width = width;
          canvas.height = height;
          if (ctx) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(croped, x, y, width, height, 0, 0, width, height);
            const croppedImage = canvas.toDataURL("image/png");
            chrome.runtime.sendMessage({
              type: "PROCESS_CROP_QRCODE",
            });
            QrScanner.scanImage(croppedImage, { returnDetailedScanResult: true })
              .then(async (result) => {
                await saveScanQrCode(result);
              }).catch((_error) => {
                alert("Not found QR in selection area!");
              });
          }
        };
      };

      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
    };

    container.addEventListener("mousedown", handleMouseDown);
    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const saveScanQrCode = async (result: QrScanner.ScanResult) => {
    const otpInstance: OtpInstance = OtpAuthUtils.toOtpInstance(result.data);
    const optInstances = await OtpAuthUtils.findAllOtpInstances();
    await chrome.storage.local.set({
      [OtpAuthUtils.OTP_INSTANCE_STORAGE_KEY]: [otpInstance, ...optInstances],
    });
    alert(`${otpInstance.accountName} added successfully!`);
  }

  return (
    <div ref={selection} style={{
      position: "fixed",
      border: "2px dashed #000",
      backgroundColor: "rgba(0,0,0,.05)"
    }} />
  )
}

export default App
