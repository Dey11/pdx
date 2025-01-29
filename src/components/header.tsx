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
    name: "Pricing",
    url: "/pricing",
  },
];
const Header = () => {
  return (
    <header className="sticky top-5 z-50 mx-auto mt-4 flex w-fit rounded-3xl bg-[#131415] text-[10px] shadow-[0px_2px_4px_#00FF1E] duration-75 ease-in-out hover:shadow-[0px_4px_6px_#00FF1E] sm:text-sm">
      <ul className="mx-auto flex items-center justify-between py-1 sm:gap-x-3 sm:px-2">
        {headerContents.map((item) => {
          return (
            <Link href={item.url} key={item.url} className="">
              <li className="rounded-3xl px-3 py-1 font-semibold ease-in-out hover:bg-white/10 hover:text-white">
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
