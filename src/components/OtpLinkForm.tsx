import OtpAuthUtils from "@/common/OtpAuthUtils";
import { OtpInstance } from "./Types";
import { useState } from "react";

const OtpLinkForm = (props: {
  onCloseModal: () => void;
  fetchOtpInstances: () => void;
}) => {

  const [rawOtpLinks, setRawOtpLinks] = useState<string>("");

  const ontTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawOtpLinks(event.target.value);
  }

  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const lines = rawOtpLinks.split(/\r?\n/);
    const otpInstances: OtpInstance[] = [];
    for (const line of lines) {
      const link = line.trim();
      if (OtpAuthUtils.validateOtpLink(link)) {
        const otpInstance: OtpInstance = OtpAuthUtils.toOtpInstance(link);
        otpInstances.push(otpInstance);
      }
    }
    const oldOptInstances = await OtpAuthUtils.findAllOtpInstances();
    await chrome.storage.local.set({ [OtpAuthUtils.OTP_INSTANCE_STORAGE_KEY]: [...otpInstances, ...oldOptInstances] });
    props.fetchOtpInstances();
    props.onCloseModal();
  };

  return (
    <form className="py-4" onSubmit={onSubmit}>
      <textarea onChange={ontTextareaChange} className="textarea h-40 whitespace-pre" wrap="off" placeholder={`otpauth://...
otpauth://...
otpauth://...`} required>
      </textarea>
      <div className="flex flex-col gap-1 mt-4">
        <button
          className="btn bg-blue-500 w-52 text-white mx-auto"
          type="submit">
          Add Links
        </button>
      </div>
    </form>
  );
}

export default OtpLinkForm;