import { FiGithub } from "react-icons/fi";
import { FaGithub, FaInstagram } from "react-icons/fa";
import Link from "next/link";

const Header = () => {
  return (
    <header className="px-3 h-[70px] flex flex-row items-center justify-between bg-white border-b-[1px] border-b-slate-300">
      <h1 className="text-xl font-semibold text-slate-900">
        Online QR Code Generator
      </h1>

      <div className="flex flex-row items-center gap-3 text-slate-900">
        <Link href="https://github.com/ShahSaminYasar" target="_blank">
          <FaGithub className="text-lg" />
        </Link>

        <Link href="https://www.instagram.com/shah_samin_yasar" target="_blank">
          <FaInstagram className="text-lg" />
        </Link>
      </div>
    </header>
  );
};
export default Header;
