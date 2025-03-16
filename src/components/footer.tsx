import Image from "next/image";
import Link from "next/link";

import { INSTAGRAM, TWITTER } from "@/lib/constants";

const Footer = () => {
  return (
    <div className="relative mt-10 h-[35dvw] w-full overflow-clip bg-[#212121] sm:h-[20dvw]">
      <Image
        src={"/logo.png"}
        alt="Logo"
        className="absolute left-5 top-1 z-10"
        width={40}
        height={50}
      />

      <ul className="z-40 flex w-full flex-wrap justify-end gap-4 p-4 text-xs">
        <Link href={"/about"}>
          <li>About us</li>
        </Link>
        <Link href={"/policy"}>
          <li>Privacy Policy</li>
        </Link>
        <Link href={"/terms"}>
          <li>Terms of Use</li>
        </Link>
      </ul>
      <ul className="z-40 flex w-full flex-wrap items-center justify-end gap-4 px-4 text-xs">
        <span>Other links:</span>
        <Link href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
          <li>
            <Image
              src={"/footer/insta.svg"}
              alt="insta"
              width={20}
              height={20}
            />
          </li>
        </Link>
        <Link href={TWITTER} target="_blank" rel="noopener noreferrer">
          <li>
            <Image
              src={"/footer/twitter.svg"}
              alt="twitter"
              width={20}
              height={20}
            />
          </li>
        </Link>
      </ul>

      <p className="absolute -bottom-[10dvw] -left-[1dvw] -right-[4dvw] z-20 w-full text-center text-[14.8dvw] font-extrabold tracking-tighter text-black">
        PDFs with PD<span className="text-[16dvw] text-brand-green">X</span>
      </p>
    </div>
  );
};

export default Footer;
