"use client";

import React, { useEffect, useState } from "react";

import ReactPlayer from "react-player/youtube";

export default function VideoPlayer() {
  const [state, setState] = useState(false);

  useEffect(() => {
    if (typeof window !== undefined) {
      setState(true);
    }
  }, []);

  return (
    state && (
      <div className="flex h-full w-full items-center justify-center">
        <ReactPlayer
          style={{
            margin: "auto",
            width: "100%",
            maxWidth: "800px",
            maxHeight: "450px",
          }}
          url={"https://www.youtube.com/watch?v=wKQC4_lOras"}
        />
      </div>
    )
  );
}
