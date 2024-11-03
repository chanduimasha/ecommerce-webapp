"use client";

import React from "react";

const BackgroundImage = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video element */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-[570px] object-cover"
      >
        <source src="/Assets/Background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

    </div>
  );
};

export default BackgroundImage;
