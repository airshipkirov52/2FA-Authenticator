import { ReactSortable, Sortable, Store } from "react-sortablejs";

import AddOtpAuth from "./AddOtpAuth";
import OptCard from "./OptCard";
import OtpAuthUtils from "@/common/OtpAuthUtils";
import { OtpInstance } from "./Types";
import { useEffect } from "react";

const Home = (props: {
  openAddOtpAuth: boolean;
  otpInstances: OtpInstance[];
  fetchOtpInstances: (keyword?: string) => void;
  setOtpInstances: (otpInstances: OtpInstance[]) => void;
  onCloseAddOtpAuth: () => void;
}) => {

  useEffect(() => {
    props.fetchOtpInstances();
  }, []);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value.trim().toLowerCase();
    props.fetchOtpInstances(keyword);
  };

  const handleSwap = async (newState: OtpInstance[], _sortable: Sortable | null, _store: Store) => {
    if (!newState || !newState.length) return;
    await chrome.storage.local.set({
      [OtpAuthUtils.OTP_INSTANCE_STORAGE_KEY]: newState,
    });
    props.setOtpInstances(newState);
  }

  return (<>
    <section className="min-h-120 max-h-[calc(100vh-2.5rem)] overflow-y-auto scrollbar">
      <div className="relative px-4 py-2">
        <div className="absolute z-10 top-1/2 -translate-y-1/2 left-8 text-neutral-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em">
            <path xmlns="http://www.w3.org/2000/svg" d="M507.3 484.7l-141.5-141.5C397 306.8 415.1 259.7 415.1 208c0-114.9-93.13-208-208-208S-.0002 93.13-.0002 208S93.12 416 207.1 416c51.68 0 98.85-18.96 135.2-50.15l141.5 141.5C487.8 510.4 491.9 512 496 512s8.188-1.562 11.31-4.688C513.6 501.1 513.6 490.9 507.3 484.7zM208 384C110.1 384 32 305 32 208S110.1 32 208 32S384 110.1 384 208S305 384 208 384z" />
          </svg>
        </div>
        <input
          onChange={handleSearch}
          className="input pl-10 w-full"
          type="text"
          name="secretKey"
          placeholder="Search"
          required
        />
      </div>
      <ReactSortable
        swap
        list={props.otpInstances}
        setList={handleSwap}
        handle=".swap"
        className="react-sortable"
      >
        {props.otpInstances.length ? props.otpInstances.map((otpInstance) => (
          <OptCard
            key={otpInstance.id}
            otpInstance={otpInstance}
            fetchOtpInstances={props.fetchOtpInstances}
          />
        )) : <div className="my-[40%] text-neutral-500 mx-4">
          <div className="flex justify-center my-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="2em" height="2em">
              <path d="M328.5 0C227.3 0 145 82.31 145 183.5c0 10.12 .9062 20.44 2.719 30.81l-132.2 132.2C5.5 356.5 0 369.8 0 384v89.5C0 494.7 17.28 512 38.5 512h87C146.7 512 164 494.7 164 473.5V454h19.5c21.22 0 38.5-17.28 38.5-38.5V396h28c10.28 0 19.94-4 27.22-11.28l20.47-20.44C411.9 384.3 512 294.8 512 183.5C512 82.31 429.7 0 328.5 0zM295.7 314.8L282.5 311.5L246.1 348H173.1v58H116V464H48V384c0-1.312 .5313-2.594 1.469-3.531l151-151L197.2 216.3C194.4 205.2 193 194.1 193 183.5C193 108.8 253.8 48 328.5 48S464 108.8 464 183.5C464 268.8 385.1 337.1 295.7 314.8zM368 111.1c-17.67 0-32 14.33-32 32c0 17.67 14.33 32 32 32s32-14.33 32-32C400 126.3 385.7 111.1 368 111.1z" fill="currentColor" />
            </svg>
          </div>
          <p className="text-center">
            You don't have any OTP accounts yet. Click the + button or scan a QR code to get started.
          </p>
        </div>}
      </ReactSortable>
    </section>
    <AddOtpAuth
      open={props.openAddOtpAuth}
      onCloseModal={props.onCloseAddOtpAuth}
      fetchOtpInstances={props.fetchOtpInstances}
    />
  </>);
}

export default Home;