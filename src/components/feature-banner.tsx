"use client";

import { useState } from "react";

import { X } from "lucide-react";

export default function NewFeatureBanner() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="absolute top-0 z-50 mx-auto w-full gap-x-2 bg-green-500/10 p-2 text-center text-xs text-green-500 sm:text-sm">
      <span className="">Question Bank tool is now live!</span>
      <X
        className="absolute right-2 top-2 size-4 cursor-pointer text-red-500 sm:size-5"
        onClick={() => setOpen(false)}
      />
    </div>
  );
}
