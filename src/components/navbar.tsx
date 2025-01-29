"use client";

import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";

import { LogOut, Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import { Button } from "./ui/button";

const navbarLinks = [
  { name: "Dashboard", link: "/dashboard" },
  { name: "Generate", link: "/dashboard/generate" },
  { name: "Materials", link: "/history" },
  { name: "Settings", link: "/settings" },
];

const Navbar = () => {
  const pathname = usePathname();
  const session = useSession();

  return (
    <div className="flex items-center justify-between border-b border-b-muted-foreground/40 px-5 py-3 text-white">
      <Link href={"/"}>
        <Image src="/logo.png" alt="Logo" width={40} height={50} className="" />
      </Link>

      {/* Desktop Links */}
      <div className="hidden items-center justify-center gap-x-5 text-muted-foreground sm:flex">
        {navbarLinks.map((link) => {
          return (
            <Link
              href={link.link}
              key={link.name}
              className={`hover:text-brand-green ${pathname === link.link || pathname.split("/")[1] === link.link ? "text-brand-green" : ""}`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Mobile Dropdown */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Menu className="size-5 cursor-pointer text-muted-foreground hover:text-brand-green" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            {navbarLinks.map((link) => (
              <DropdownMenuItem key={link.name} asChild>
                <Link
                  href={link.link}
                  className={`w-full ${pathname === link.link ? "text-brand-green" : ""}`}
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
                  Logout
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
        {/* <LogOut className="size-5 cursor-pointer" onClick={() => signOut()} /> */}
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
        <LogOut className="size-5 cursor-pointer" />
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
