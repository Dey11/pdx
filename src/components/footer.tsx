import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="relative mt-10 h-[20dvw] w-full overflow-clip bg-[#212121]">
      <Image
        src={"/logo.png"}
        alt="Logo"
        className="absolute left-5 top-1 z-10"
        width={40}
        height={50}
      />

      <ul className="z-40 flex w-full flex-wrap justify-end gap-4 p-4 text-xs">
        <Link href={"/contact"}>
          <li>Contact Us</li>
        </Link>
        <Link href={"/policy"}>
          <li>Privacy Policy</li>
        </Link>
        <Link href={"/terms"}>
          <li>Terms of Service</li>
        </Link>
      </ul>

      <p className="absolute -bottom-[10dvw] -left-[1dvw] -right-[4dvw] z-20 w-full text-center text-[14.8dvw] font-extrabold tracking-tighter text-black">
        PDFs with PD<span className="text-[16dvw] text-brand-green">X</span>
      </p>
    </div>
  );
};

export default Footer;
