"use client";

import { Merriweather } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogOut, Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";

const navbarLinks = [
  { name: "DASHBOARD", link: "/dashboard" },
  // { name: "GENERATE", link: "/dashboard/generate" },
  { name: "MATERIALS", link: "/history" },
  { name: "SETTINGS", link: "/settings" },
  { name: "PRICING", link: "/pricing" },
];
const merriweather = Merriweather({ weight: "400", subsets: ["latin"] });
const Navbar = () => {
  const pathname = usePathname();
  const session = useSession();

  return (
    <div
      className={`z-10 flex items-center justify-between border-b border-b-brand-heading/30 p-4 text-white sm:px-10`}
    >
      <Link href={"/"}>
        <Image src="/logo.png" alt="Logo" width={40} height={50} className="" />
      </Link>

      {/* Desktop Links */}
      <div
        className={`${merriweather.className} sm:gap-x-10" hidden items-center justify-center gap-x-4 text-muted-foreground sm:flex`}
      >
        {navbarLinks.map((link) => {
          return (
            <Link
              href={link.link}
              key={link.name}
              className={`p-1 text-xs text-brand-heading underline-offset-1 transition-all duration-200 hover:-translate-y-1 hover:text-brand-yellow hover:underline hover:underline-offset-4 sm:text-base ${pathname === link.link || pathname.split("/")[1] === link.link ? "text-brand-yellow" : ""}`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Mobile Dropdown */}
      <div className={`sm:hidden ${merriweather.className}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Menu className="size-5 cursor-pointer text-brand-heading hover:text-brand-yellow" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            {navbarLinks.map((link) => (
              <DropdownMenuItem key={link.name} asChild>
                <Link
                  href={link.link}
                  className={`w-full text-brand-heading ${pathname === link.link ? "text-brand-yellow" : ""}`}
                >
                  {link.name}
                </Link>
              </DropdownMenuItem>
            ))}
            {session.status === "authenticated" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-sm font-medium">
                  {session.data.user?.name}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-red-500"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 size-4" />
                  LOGOUT
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop User Section */}
      <div className="hidden items-center justify-center gap-x-4 sm:flex">
        {session.status === "loading" && (
          <div className="size-7 animate-pulse rounded-full bg-white" />
        )}
        {session.status === "authenticated" && session.data.user?.image && (
          <Image
            src={session.data.user?.image}
            alt="User profile picture"
            width={28}
            height={28}
            className="rounded-full"
          />
        )}
        <LogOutBtn />
      </div>
    </div>
  );
};

export default Navbar;

const LogOutBtn = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="hidden rounded-none border border-b-[4px] border-brand-heading px-4 py-1 text-sm font-semibold transition-all duration-100 hover:translate-y-1 hover:border-b md:block">
          LOGOUT
        </div>
      </DialogTrigger>
      <DialogContent className="w-40 p-10 text-center">
        <DialogHeader className="flex flex-col items-center justify-center gap-5">
          <DialogTitle>Log out?</DialogTitle>
          <Button
            variant={"outline"}
            className="w-full"
            onClick={() => {
              signOut();
            }}
          >
            Yes
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
