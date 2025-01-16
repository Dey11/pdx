import Link from "next/link";

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
    name: "Join waitlist",
    url: "/waitlist",
  },
];
const Header = () => {
  return (
    <header className="sticky top-5 z-50 mx-auto mt-4 flex w-fit rounded-xl bg-[#131415] px-2 text-[10px] shadow-[0px_0px_3px_#00FF1E_inset] transition-shadow delay-300 duration-300 ease-in-out sm:text-sm">
      <ul className="mx-auto flex items-center justify-between py-1 sm:gap-x-8 sm:px-6">
        {headerContents.map((item) => {
          return (
            <Link href={item.url} key={item.url} className="">
              <li className="rounded-lg px-3 font-semibold hover:bg-brand-green hover:text-brand-bg hover:underline">
                {item.name}
              </li>
            </Link>
          );
        })}
      </ul>
    </header>
  );
};

export default Header;
