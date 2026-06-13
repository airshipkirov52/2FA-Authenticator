import React, { useState } from "react";

const Otp = (props: { children: React.ReactNode, value: string, isExpiredSoon?: boolean }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async () => {
    const value = props.value;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        setCopied(value);
      } else {
        fallbackCopy(value);
      }
    } catch {
      fallbackCopy(value);
    }
    setTimeout(() => setCopied(null), 1000);
  };

  const fallbackCopy = (value: string) => {
    const input = document.createElement("input");
    input.value = value;
    input.style.position = "fixed";
    input.style.top = "0";
    input.style.left = "0";
    input.style.width = "1px";
    input.style.height = "1px";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, 99999);
    try {
      if (document.execCommand("copy")) {
        setCopied(value);
        setTimeout(() => setCopied(null), 1000);
      }
    } catch (error) {
      console.error(error)
    }
    document.body.removeChild(input);
  }

  return (<div className="flex items-center gap-6">
    <div className={`text-4xl text-[#00a2ff] font-bold ${props.isExpiredSoon && "text-red-400 animate-pulse"} font-semibold cursor-pointer`} onClick={handleCopy}>
      {props.children}
    </div>
    {copied && (<div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 text-center bg-black/50 p-3 rounded-md text-white flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16">
        <path d="M475.3 123.3l-272 272C200.2 398.4 196.1 400 192 400s-8.188-1.562-11.31-4.688l-144-144c-6.25-6.25-6.25-16.38 0-22.62s16.38-6.25 22.62 0L192 361.4l260.7-260.7c6.25-6.25 16.38-6.25 22.62 0S481.6 117.1 475.3 123.3z" fill="currentColor" />
      </svg>
      Copied!
    </div>)}
  </div>);
}

export default Otp;