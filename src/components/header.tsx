import { Merriweather } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { Button } from "./ui/button";

const headerContents = [
  {
    name: "HOME",
    url: "/",
  },
  {
    name: "DASHBOARD",
    url: "/dashboard",
  },
  {
    name: "ABOUT",
    url: "/about",
  },
  {
    name: "PRICING",
    url: "/pricing",
  },
];

const merriweather = Merriweather({ weight: "400", subsets: ["latin"] });

const Header = () => {
  return (
    <nav className="z-10 mt-4 flex items-center justify-between px-4 sm:px-10">
      <Image
        src="/logo.png"
        alt="PDX Study Material Generator Logo"
        width={50}
        height={50}
        className="mb-1 hidden md:block"
      />
      <div className="mx-auto flex items-center justify-center gap-4 sm:gap-16">
        {headerContents.map((item) => (
          <Link
            key={item.name}
            href={item.url}
            className={`text-brand-heading ${merriweather.className} p-1 text-xs underline-offset-1 transition-all duration-200 hover:-translate-y-1 hover:text-brand-yellow hover:underline hover:underline-offset-4 sm:text-base`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <Link href={"/dashboard"}>
        <Button className="hidden rounded-none border border-b-4 border-brand-heading px-4 py-1 transition-all duration-100 hover:translate-y-1 hover:border-b md:block">
          TRY NOW
        </Button>
      </Link>
    </nav>
  );
};

export default Header;
