import bcrypt from "bcryptjs";
import { useState } from "react";

const SecurityValidation = (props: {
  onValidatePassword: (isWrongPassword: boolean) => void;
}) => {

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const password = (formData.get("password") as string).trim();
    const result = await chrome.storage.local.get("securityHash");
    const hash = result.securityHash as string;
    const isValidPassword = bcrypt.compareSync(password, hash);
    if(!isValidPassword) {
      setError("Incorrect password.")
    } else {
      setError(null);
    };
    props.onValidatePassword(isValidPassword);
  }

  return (<div className="w-92">
    <form onSubmit={onSubmit} className="flex flex-col justify-center gap-2 px-8 min-h-92">
      <div className="flex flex-col items-center gap-1 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="5em" height="5em">
          <path d="M384 223.1L368 224V144c0-79.41-64.59-144-144-144S80 64.59 80 144V224L64 223.1c-35.35 0-64 28.65-64 64v160c0 35.34 28.65 64 64 64h320c35.35 0 64-28.66 64-64v-160C448 252.7 419.3 223.1 384 223.1zM144 144C144 99.88 179.9 64 224 64s80 35.88 80 80V224h-160V144z" />
        </svg>
      </div>
      <p>
        Your app was previously locked, please enter the password to access it.
      </p>
      <div className="flex flex-col gap-1 w-full">
        <input
          className="input w-full"
          type="password"
          name="password"
          placeholder="Please enter your password"
          required
        />
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="flex flex-col gap-1 mt-2">
        <button
          className="btn bg-blue-500 text-white mx-auto"
          type="submit">
          Confirm
        </button>
      </div>
    </form>
  </div>);

};

export default SecurityValidation;