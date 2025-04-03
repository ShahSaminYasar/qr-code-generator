import Image from "next/image";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";

const HistoryQRCode = ({
  qrCode,
  index,
  setEntriedLink,
  setQRcodeURL,
  entriedLink,
  removeFromHistory,
}) => {
  const urlObj = new URL(qrCode);
  const qrLink = urlObj.searchParams.get("data");

  return (
    <div
      key={`${qrCode}_${index}`}
      className="flex flex-row justify-between items-center p-5 gap-5 text-slate-800 font-normal border-b-[1px] border-b-slate-300 last:border-b-[0px]"
    >
      <button
        onClick={() => {
          removeFromHistory(index);
        }}
        className="cursor-pointer"
      >
        <IoMdClose className="text-sm text-slate-300" />
      </button>
      <span
        className={`w-full block text-left ${
          qrLink === entriedLink ? "font-semibold" : null
        }`}
        onClick={() => {
          setEntriedLink(qrLink);
          setQRcodeURL(
            `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrLink}`
          );
        }}
      >
        {qrLink}
      </span>
      <Image
        src={qrCode}
        height={40}
        width={40}
        alt={qrCode}
        className="block w-[40px] h-[40px] aspect-square object-contain"
        onClick={() => {
          setEntriedLink(qrLink);
          setQRcodeURL(
            `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrLink}`
          );
        }}
      />
      <Link
        href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrLink}`}
        target="_blank"
      >
        <MdOutlineFileDownload className="text-xl text-slate-600" />
      </Link>
    </div>
  );
};
export default HistoryQRCode;
