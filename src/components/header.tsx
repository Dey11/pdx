import { SignInButton, SignedOut } from "@clerk/nextjs";

import { H3 } from "./typography/h3";
import { Button } from "./ui/button";

[].forEach(function (ok) {
  console.log(ok);
});

const Header = () => {
  return (
    <header className="flex border-b border-black p-3">
      <div className="mx-auto flex w-full max-w-screen-lg items-center justify-between">
        <H3>Logo</H3>
        <SignedOut>
          <Button asChild>
            <SignInButton />
          </Button>
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;
