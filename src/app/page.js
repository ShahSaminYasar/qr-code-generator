"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";
import Link from "next/link";

export default function Home() {
  // Refs
  const linkInputRef = useRef(null);

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

  // Functions
  const generateQR = async (link) => {
    if (!link) {
      setErrorMessage("Please enter a valid link.");
      return;
    }
    setGeneratingQRCode(true);
    setEntriedLink(link);
    setQRcodeURL(
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${link}`
    );
    setGeneratingQRCode(false);

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
  };

  const refreshHistory = () => {
    let localData = localStorage.getItem("qr_codes");
    setQrHistory(localData ? JSON.parse(localData) : []);
  };

  const removeFromHistory = (index) => {
    let newHistory = qrHistory.filter((_, i) => i !== index);
    localStorage.setItem("qr_codes", JSON.stringify(newHistory));
    refreshHistory();
  };

  return (
    <main className="w-full bg-gradient-to-br from-slate-100 to-slate-100 text-slate-700 font-medium text-sm px-3">
      <section className="min-h-screen w-full max-w-xl mx-auto py-5 flex flex-col justify-center gap-3">
        <div className="h-fit w-full rounded-sm border-[1px] border-slate-300 bg-slate-50 p-3">
          <h1 className="text-2xl font-semibold text-slate-900">
            Online QR Code Generator
          </h1>
          <div className="relative w-fit mx-auto">
            {entriedLink && (
              <Link
                href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${entriedLink}`}
                target="_blank"
                className="absolute bottom-6 -right-7 border-[1px] border-slate-300 rounded-sm"
              >
                <MdOutlineFileDownload className="text-xl text-slate-500" />
              </Link>
            )}
            <Image
              key={QRcodeURL}
              src={
                QRcodeURL ||
                "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://shahsaminyasar.vercel.app"
              }
              width={150}
              height={150}
              alt={`QR Code`}
              className={`block p-[6px] mt-5 mx-auto w-[150px] aspect-square rounded-sm bg-white border-[1px] border-slate-300 ${
                QRcodeURL?.length > 0 ? "opacity-100" : "opacity-10"
              }`}
            />
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
            className="w-full flex flex-row items-center gap-1"
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
              className="whitespace-nowrap px-2 py-1 bg-slate-900 text-slate-100 border-[1px] border-slate-900 rounded-sm text-sm cursor-pointer disabled:grayscale-[60%] disabled:opacity-50"
              disabled={generatingQRCode}
            >
              {generatingQRCode ? "Generating code..." : "Generate QR Code"}
            </button>
          </form>
        </div>

        {/* History Section */}
        <div className="w-full rounded-sm border-[1px] border-slate-300 bg-slate-50 p-3 border-b-[1px] border-b-slate-300">
          {/* Section Title */}
          <h3 className="block text-left text-lg font-semibold text-slate-900">
            History
          </h3>

          <div className="flex flex-col-reverse w-full max-h-[30vh] overflow-y-auto">
            {/* QR Code Rows */}
            {qrHistory?.map((qrCode, index) => {
              let urlObj = new URL(qrCode);
              let qrLink = urlObj.searchParams.get("data");

              return (
                <div
                  key={`${qrCode}_${index}`}
                  className="flex flex-row justify-between items-center p-5 gap-5 text-slate-800 font-normal border-b-[1px] border-b-slate-300 first:border-b-[0px]"
                >
                  <button
                    onClick={() => {
                      removeFromHistory(index);
                    }}
                    className="cursor-pointer"
                  >
                    <IoTrashBinOutline className="text-lg" />
                  </button>
                  <span className="w-full block text-left">{qrLink}</span>
                  <Link
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrLink}`}
                    target="_blank"
                  >
                    <MdOutlineFileDownload className="text-xl text-slate-600" />
                  </Link>
                  <Image
                    src={qrCode}
                    height={40}
                    width={40}
                    alt={qrCode}
                    className="block w-[40px] h-[40px] aspect-square object-contain"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {errorMessage && (
        <span className="block w-full max-w-[400px] p-2 border-2 border-red-700 bg-red-500 text-red-900 text-shadow rounded-sm text-center mx-auto absolute bottom-5 left-[50%] -translate-x-[50%]">
          <button onClick={() => setErrorMessage("")}>
            <IoMdClose className="text-xl text-red-900 absolute top-[50%] left-3 -translate-y-[50%] cursor-pointer" />
          </button>
          {errorMessage}
        </span>
      )}

      <span className="block py-3 text-center text-xs font-light text-slate-700">
        Copyright 2025 &copy;{" "}
        <Link
          href={"https://shahsaminyasar.vercel.app"}
          target="_blank"
          className="font-medium"
        >
          SHAH SAMIN YASAR
        </Link>
      </span>
    </main>
  );
}
