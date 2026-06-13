import OtpAuthUtils from "@/common/OtpAuthUtils";
import type { OtpInstance } from "./Types";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ManualForm = (props: {
  onCloseModal: () => void;
  fetchOtpInstances: () => void;
}) => {
  const [otpInstance, setOtpInstance] = useState<OtpInstance>({
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    type: "TOTP",
  } as OtpInstance);
  const [collapse, setCollapse] = useState(false);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtpInstance(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOtpInstance(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const optInstances = await OtpAuthUtils.findAllOtpInstances();
    await chrome.storage.local.set({
      [OtpAuthUtils.OTP_INSTANCE_STORAGE_KEY]: [{ ...otpInstance, id: uuidv4() }, ...optInstances],
    });
    setOtpInstance({ period: 30 } as OtpInstance);
    props.fetchOtpInstances();
    props.onCloseModal();
  };

  return (<form onSubmit={onSubmit} className="py-4">
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <label className="font-semibold">Account Name</label>
        <input
          className="input w-full"
          type="text"
          name="accountName"
          placeholder="e.g., example@gmail.com"
          onChange={onInputChange}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-semibold">Secret Key</label>
        <input
          className="input w-full"
          type="text"
          name="secretKey"
          placeholder="Enter Secret Key"
          onChange={onInputChange}
          required
        />
      </div>
      <button
        type="button"
        onClick={() => setCollapse(!collapse)}
        className="w-full flex items-center gap-3 py-2 transition"
      >
        <span className="font-medium">Advance Settings</span>
        <span className={`transition-transform duration-300 ${collapse ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      {collapse && (<>
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Service</label>
          <input
            className="input w-full"
            type="text"
            name="issuer"
            placeholder="e.g., Google"
            onChange={onInputChange}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 w-full">
            <label className="font-semibold">Algorithm</label>
            <select
              className="select w-full"
              name="algorithm"
              onChange={onSelectChange}>
              <option value="sha1">SHA1</option>
              <option value="sha256">SHA256</option>
              <option value="sha512">SHA512</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label className="font-semibold">Digits</label>
            <select
              className="select w-full"
              name="digits"
              onChange={onSelectChange}>
              <option value="6">6</option>
              <option value="8">8</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label className="font-semibold">Period</label>
            <input
              className="input w-full"
              type="number"
              name="period"
              onChange={onInputChange}
              value={otpInstance.period}
            />
          </div>
        </div>
      </>)}
    </div>
    <div className="flex flex-col gap-1 mt-4">
      <button
        className="btn bg-blue-500 w-52 text-white mx-auto"
        type="submit">
        Add
      </button>
    </div>
  </form>
  );
}

export default ManualForm;