import { useEffect, useState } from "react";

import bcrypt from "bcryptjs";

interface SecurityPayload {
  oldPassword?: string;
  password: string;
  confirmPassword: string;
}

const SecurityForm = (props: {
  open: boolean;
  onCloseModal: () => void;
}) => {

  const [securityHash, setSecurityHash] = useState<string | undefined>();
  const [securityPayload, setSecurityPayload] = useState<SecurityPayload>({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    chrome.storage.local.get("securityHash").then(({ securityHash }) => {
      setSecurityHash(securityHash as string);
    });
  }, []);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityPayload(prev => ({ ...prev, [event.target.name]: event.target.value }));
  }

  const saveSecurity = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (securityHash && !bcrypt.compareSync(securityPayload.oldPassword as string, securityHash)) {
      setError("Incorrect old password.");
      return;
    }

    if (securityPayload.password !== securityPayload.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    await chrome.storage.local.set({ 
      locked: false,
      securityHash: bcrypt.hashSync(securityPayload.password),
     });
    window.close();
  }

  const deleteSecurity = async () => {
    if (securityHash && !bcrypt.compareSync(securityPayload.password, securityHash)) {
      setError("Incorrect old password.");
      return;
    }
    setError(null);
    await chrome.storage.local.remove("securityHash");
    await chrome.storage.local.remove("locked");
    window.close();
  }

  return (<>
    <input type="checkbox" id="AddOtpAuth" className="modal-toggle" checked={props.open} />
    <div className="modal" role="dialog">
      <div className="modal-box overflow-hidden p-0">
        <div className="relative px-4 py-3 h-8">
          <span className="w-4 h-4 absolute top-3 left-2 cursor-pointer" onClick={props.onCloseModal}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
            </svg>
          </span>
        </div>
        <div className="w-full h-full px-4 pb-6">
          <p className="text-red-500 mb-2">
            Password is used to encrypt your account. No one can help you if you forget your password.
          </p>
          <form className="flex flex-col gap-2" onSubmit={saveSecurity}>
            {securityHash && (<div className="flex flex-col gap-1 w-full">
              <label className="font-semibold">Old Password</label>
              <input
                onChange={onInputChange}
                className="input input-sm w-full"
                type="password"
                name="oldPassword"
                required
              />
            </div>)}
            <div className="flex flex-col gap-1 w-full">
              <label className="font-semibold">Password</label>
              <input
                onChange={onInputChange}
                className="input input-sm w-full"
                type="password"
                name="password"
                required
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="font-semibold">Confirm Password</label>
              <input
                onChange={onInputChange}
                className="input input-sm w-full"
                type="password"
                name="confirmPassword"
                required
              />
            </div>
            {error && (<p className="text-red-500 text-center mt-2">{error}</p>)}
            <div className="flex justify-center gap-2 mt-2">
              <button
                className="btn btn-sm bg-blue-500 text-white"
                type="submit">
                Confirm
              </button>
              {securityHash && (<button
                onClick={deleteSecurity}
                className="btn btn-sm bg-blue-500 text-white"
                type="button">
                Delete
              </button>)}
            </div>
          </form>
        </div>
      </div>
    </div>
  </>);
}

export default SecurityForm