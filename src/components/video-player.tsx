"use client";

import React, { useEffect, useState } from "react";

import ReactPlayer from "react-player/youtube";

import { YOUTUBE_LINK } from "@/lib/constants";

export default function VideoPlayer() {
  const [state, setState] = useState(false);

  useEffect(() => {
    if (typeof window !== undefined) {
      setState(true);
    }
  }, []);

  return (
    state && (
      <div className="flex h-full w-full items-center justify-center sm:w-fit">
        <ReactPlayer
          style={{
            margin: "auto",
            // width: "100%",
            maxWidth: "600px",
            maxHeight: "350px",
          }}
          url={YOUTUBE_LINK}
        />
      </div>
    )
  );
}
