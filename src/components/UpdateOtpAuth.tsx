import type { OtpInstance } from "./Types";
import { useState } from "react";

const UpdateOtpAuth = (props: {
  open: boolean;
  otpInstance: OtpInstance;
  onCloseModal: () => void;
  fetchOtpInstances: () => void;
}) => {

  const [otpInstance, setOtpInstance] = useState<OtpInstance>(props.otpInstance);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtpInstance(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = otpInstance.id;
    await chrome.storage.local.set({
      [id]: { ...otpInstance }
    });
    props.fetchOtpInstances();
    props.onCloseModal();
  };

  if (!props.open) return null;

  return (<div className="modal modal-open" role="dialog">
    <div className="modal-box overflow-hidden max-h-[80vh] p-0">
      <div className="relative px-4 py-3 border-b border-gray-300">
        <h3 className="text-xl font-semibold">Update Account</h3>
        <span className="w-4 h-4 absolute top-3 right-2 cursor-pointer" onClick={props.onCloseModal}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
          </svg>
        </span>
      </div>
      <div className="mt-3 w-full px-4 max-h-[calc(100vh-175px)] overflow-y-auto scrollbar">
        <div className="py-3">
          <form className="overflow-y-auto" onSubmit={onSubmit}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label className="font-semibold">Account Name</label>
                <input
                  onChange={onInputChange}
                  value={otpInstance.accountName}
                  className="bg-white outline-0 border border-gray-300 rounded px-2 py-1.5 w-full"
                  type="text"
                  name="accountName"
                  placeholder="e.g., example@gmail.com"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-semibold">Service</label>
                <input
                  onChange={onInputChange}
                  value={otpInstance.issuer}
                  className="bg-white outline-0 border border-gray-300 rounded px-2 py-1.5 w-full"
                  type="text"
                  name="issuer"
                  placeholder="e.g., Google"
                  required
                />
              </div>
              <div className="relative flex flex-col gap-1">
                <label className="font-semibold">Secret Key</label>
                <div className="relative">
                  <input
                    disabled
                    onChange={onInputChange}
                    value={showSecretKey ? otpInstance.secretKey : "•".repeat(20)}
                    className="bg-neutral-100 outline-0 border border-gray-300 rounded px-2 py-1.5 w-full "
                    type={showSecretKey ? "text" : "password"}
                    name="issuer"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="w-5 h-4 absolute top-2 right-4 cursor-pointer"
                  >
                    {showSecretKey ? (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                      <path d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z" />
                    </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 512">
                      <path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z" />
                    </svg>)}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-4">
              <button
                className="btn bg-blue-500 w-52 text-white mx-auto"
                type="submit">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>);
}

export default UpdateOtpAuth;