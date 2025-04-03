import Link from "next/link";

const Footer = () => {
  return (
    <footer className="block w-full bg-white p-3 border-t-[1px] border-t-slate-300 rounded-sm">
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
    </footer>
  );
};
export default Footer;
