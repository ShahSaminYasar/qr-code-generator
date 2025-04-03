import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import HistoryQRCode from "./HistoryQRCode";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const App = () => {
  // Refs
  const linkInputRef = useRef(null);
  const generatingQRTLRef = useRef(null);
  const flashHistoryRef = useRef(null);

  // States
  const [generatingQRCode, setGeneratingQRCode] = useState(false);
  const [QRcodeURL, setQRcodeURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [qrHistory, setQrHistory] = useState([]);
  const [entriedLink, setEntriedLink] = useState("");

  // Effects
  useEffect(() => {
    refreshHistory();
  }, []);

  useGSAP(() => {
    if (!generatingQRTLRef.current) {
      generatingQRTLRef.current = gsap.timeline({ paused: true });
    }

    if (!flashHistoryRef.current) {
      flashHistoryRef.current = gsap.timeline();
    }

    flashHistoryRef.current
      .set("#animation_history_cover", {
        opacity: 1,
        duration: 0,
        delay: 1.3,
      })
      .to("#animation_history_cover", {
        opacity: 0,
        duration: 0.3,
        delay: 0.7,
      });

    generatingQRTLRef.current
      .set(
        "#animation_generating_subject",
        {
          opacity: 0,
        },
        "a"
      )
      .from(
        "#animation_generating_container",
        {
          display: "none",
        },
        "a"
      )
      .from(
        "#animation_generating_inner",
        {
          translateX: "-100%",
          translateY: "100%",
          duration: 0.7,
          ease: "expo.out",
        },
        "a"
      )
      .set("#animation_generating_subject", {
        opacity: 0.75,
        translateY: 5,
        duration: 0.01,
      })
      .to(
        "#animation_generating_subject",
        {
          translateY: -10,
          rotate: "7deg",
          opacity: 1,
          duration: 0.8,
          delay: 0,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        },
        "b"
      );
  }, []);

  // Functions
  const generateQR = async (link) => {
    if (!link) {
      setErrorMessage("Please enter a valid link.");
      return;
    }
    setGeneratingQRCode(true);
    generatingQRTLRef.current.play();
    flashHistoryRef.current.restart();

    setTimeout(() => {
      setEntriedLink(link);
      setQRcodeURL(
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${link}`
      );
      setGeneratingQRCode(false);

      linkInputRef.current.value = "";

      let isEntriedAlready = false;
      qrHistory.forEach((entry) => {
        let entryLink = new URL(entry);
        entryLink = entryLink.searchParams.get("data");
        if (entryLink === link) {
          isEntriedAlready = true;
        }
      });
      if (!isEntriedAlready) {
        let localData = qrHistory;
        localData.push(
          `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${link}`
        );
        localStorage.setItem("qr_codes", JSON.stringify(localData));
        refreshHistory();
      }
      generatingQRTLRef.current.reverse();
      setGeneratingQRCode(false);
    }, 1600);
  };

  const refreshHistory = () => {
    let localData = localStorage.getItem("qr_codes");
    setQrHistory(localData ? JSON.parse(localData) : []);
  };

  const removeFromHistory = (index) => {
    let newHistory = [...qrHistory]?.reverse()?.filter((_, i) => i !== index);
    localStorage.setItem(
      "qr_codes",
      JSON.stringify([...newHistory]?.reverse())
    );
    refreshHistory();
  };

  return (
    <main className="w-full min-h-[78vh] bg-slate-100 text-slate-700 font-medium text-sm px-3">
      <div className="max-w-xl mx-auto my-5 rounded-sm border-[1px] border-slate-300 bg-white p-3">
        <div className="relative w-fit mx-auto">
          {/* Download Button */}
          {entriedLink && (
            <Link
              href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${entriedLink}`}
              target="_blank"
              className="absolute bottom-6 -right-7 border-[1px] border-slate-300 rounded-sm"
            >
              <MdOutlineFileDownload className="text-xl text-slate-500" />
            </Link>
          )}

          {/* Target QR Code */}
          <div
            className={`p-[6px] mt-5 w-[150px] mx-auto aspect-square rounded-sm overflow-hidden border-[1px] border-slate-300 relative ${
              QRcodeURL?.length > 0 ? null : "mb-[36px]"
            }`}
          >
            <Image
              key={QRcodeURL}
              src={
                QRcodeURL ||
                "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://shahsaminyasar.vercel.app"
              }
              width={150}
              height={150}
              alt={`QR Code`}
              className={`w-[150px] aspect-square object-contain ${
                QRcodeURL?.length > 0 ? "opacity-100" : "opacity-10"
              }`}
            />

            {/* Generating animation layer */}
            <div
              id="animation_generating_container"
              className="w-full absolute top-0 left-0 h-full flex items-center justify-center"
            >
              {/* Animation inner layer */}
              <div
                id="animation_generating_inner"
                className="w-[400px] h-[400px] aspect-square top-0 left-0 translate-x-0 translate-y-0 bg-gradient-to-br flex items-center justify-center rounded-r-full"
                style={{
                  background:
                    "linear-gradient(-45deg, #1f2c40, #242a33, #242a33, #1f2c40)",
                }}
              >
                <Image
                  id="animation_generating_subject"
                  src={"/assets/pan-light.png"}
                  width={120}
                  height={120}
                  alt="Cooking pan"
                  className="block translate-y-0 opacity-100"
                />
              </div>
            </div>
          </div>

          {/* Target Link */}
          <span className="block text-center text-xs font-medium text-slate-600 mt-2 mb-3">
            {entriedLink}
          </span>
        </div>

        {/* Link Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateQR(linkInputRef.current.value);
          }}
          className="w-full flex flex-col sm:flex-row items-center gap-1"
        >
          {/* Link Input */}
          <input
            ref={linkInputRef}
            type="text"
            placeholder="Put the link here"
            className="w-full rounded-sm border-[1px] border-slate-300 px-2 py-1 text-sm outline-[0px] focus:border-slate-400"
          />
          {/* Generate QR Btn */}
          <button
            type="submit"
            className="whitespace-nowrap px-2 py-1 bg-slate-900 text-slate-100 border-[1px] border-slate-900 rounded-sm text-sm cursor-pointer disabled:grayscale-[60%] disabled:opacity-50 block mx-auto w-full text-center sm:w-fit"
            disabled={generatingQRCode}
          >
            {generatingQRCode ? "Generating code..." : "Generate QR Code"}
          </button>
        </form>
      </div>

      {/* History Section */}
      <div className="max-w-xl mx-auto my-5 rounded-sm border-[1px] border-slate-300 bg-white p-3 border-b-[1px] border-b-slate-300">
        {/* Section Title */}
        <h3 className="block text-left text-lg font-semibold text-slate-900">
          History
        </h3>
        <div className="flex flex-col w-full max-h-[29vh] overflow-y-auto relative">
          <div
            id="animation_history_cover"
            className="opacity-100 pointer-events-none absolute top-0 left-0 w-full h-full bg-[rgba(255,255,255,0.7)] backdrop-blur-md"
          ></div>
          {/* QR Code Rows */}
          {[...qrHistory]?.reverse()?.map((qrCode, index) => (
            <HistoryQRCode
              key={`${qrCode}_${index}`}
              qrCode={qrCode}
              index={index}
              setEntriedLink={setEntriedLink}
              setQRcodeURL={setQRcodeURL}
              entriedLink={entriedLink}
              removeFromHistory={removeFromHistory}
            />
          ))}
        </div>
      </div>
    </main>
  );
};
export default App;
