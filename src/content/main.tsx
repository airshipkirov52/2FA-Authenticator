import { Root, createRoot } from 'react-dom/client'

import App from './views/App.tsx'
import { StrictMode } from 'react'

console.log('[CRXJS] Hello world from content script!')

const container = document.createElement('div')
container.id = 'crxjs-app'
container.style.position = "fixed";
container.style.top = "0";
container.style.left = "0";
container.style.zIndex = "999999";
container.style.width = "100%";
container.style.height = "100%";
container.style.backgroundColor = "rgba(0,0,0,.15)";
container.style.cursor = "crosshair";

let reactRoot: Root | null = null;

const handleEndCropQrcode = () => {
  setTimeout(() => {
    if (document.getElementById('crxjs-app')) {
      if (reactRoot) {
        reactRoot.unmount();
        reactRoot = null;
      }
      if (container.parentNode) {
        document.body.removeChild(container);
      }
    }
  }, 100);
}

chrome.runtime.onMessage.addListener((message) => {
  console.log("🚀 ~ message:", message)
  if (message.type === "START_CROP_QRCODE") {
    if (!document.getElementById('crxjs-app')) {
      document.body.appendChild(container);
      reactRoot = createRoot(container);
      reactRoot.render(
        <StrictMode>
          <App />
        </StrictMode>
      );
    }
  }

  if (message.type === "END_CROP_QRCODE") {
    handleEndCropQrcode();
  }
  return true;
});
