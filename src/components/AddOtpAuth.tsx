import ManualForm from "./ManualForm";
import OtpLinkForm from "./OtpLinkForm";
import QRCodeForm from "./QrCodeForm";
import { useState } from "react";

const AddOtpAuth = (props: {
  open: boolean;
  onCloseModal: () => void;
  fetchOtpInstances: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<"qr_code" | "otp_links" | "manual">("qr_code");

  if (!props.open) return null;
  
  return (<div className="modal modal-open" role="dialog">
      <div className="modal-box overflow-hidden max-h-[80vh] p-0">
        <div className="relative px-4 py-3 border-b border-gray-300">
          <h3 className="text-xl font-semibold">Add Account</h3>
          <span className="w-4 h-4 absolute top-3 right-2 cursor-pointer" onClick={props.onCloseModal}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
            </svg>
          </span>
        </div>
        <div className="mt-3 w-full px-4 max-h-[calc(100vh-175px)] overflow-y-auto scrollbar">
          <div className="py-3">
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setActiveTab("qr_code")}
                className={`btn flex-1/2 ${activeTab === "qr_code" && "bg-blue-500! text-white!"}`}
              >
                QR code
              </button>
              <button
                onClick={() => setActiveTab("otp_links")}
                className={`btn flex-1/2 ${activeTab === "otp_links" && "bg-blue-500! text-white!"}`}
              >
                Otp Links
              </button>
              <button
                onClick={() => setActiveTab("manual")}
                className={`btn flex-1/2 ${activeTab === "manual" && "bg-blue-500! text-white!"}`}
              >
                Manual
              </button>
            </div>
            {activeTab === "qr_code" && (<QRCodeForm
              onCloseModal={props.onCloseModal}
              fetchOtpInstances={props.fetchOtpInstances}
            />)}
            {activeTab === "otp_links" && (<OtpLinkForm
              onCloseModal={props.onCloseModal}
              fetchOtpInstances={props.fetchOtpInstances}
            />)}
            {activeTab === "manual" && (<ManualForm
              onCloseModal={props.onCloseModal}
              fetchOtpInstances={props.fetchOtpInstances}
            />)}
          </div>
        </div>
      </div>
    </div>)
}

export default AddOtpAuth;