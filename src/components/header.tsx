import { Merriweather } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { Button } from "./ui/button";

const headerContents = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Dashboard",
    url: "/dashboard",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Pricing",
    url: "/pricing",
  },
];

const merriweather = Merriweather({ weight: "400", subsets: ["latin"] });

const Header = () => {
  return (
    <nav className="mt-4 flex items-center justify-between gap-16 px-4 sm:px-10">
      <Image
        src="/logo.png"
        alt="PDX Study Material Generator Logo"
        width={40}
        height={50}
        className="mb-1 hidden md:block"
      />
      <div className="flex items-center justify-center gap-4">
        {headerContents.map((item) => (
          <Link
            key={item.name}
            href={item.url}
            className={`text-brand-heading ${merriweather.className} hover:text-brand-yellow p-1 underline-offset-1 transition-all duration-200 hover:-translate-y-1 hover:underline hover:underline-offset-4`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <Button className="rounded-none border border-brand-heading px-4 py-1">
        TRY NOW
      </Button>
    </nav>
  );
};

export default Header;
