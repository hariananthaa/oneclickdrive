import Image from "next/image";
import React from "react";

export default function Logo() {
  return (
    <a href="/" className="flex items-center gap-2 self-center font-medium">
      <Image
        className="dark:invert"
        src="https://www.oneclickdrive.com/application/views/images/main-logo-mob.svg?v=4"
        alt="OneClickDrive logo"
        width={180}
        height={38}
        priority
      />
    </a>
  );
}
