
import { ModeToggle } from "@/components/ToggleDark";
import Link from "next/link";
import React, { use } from "react";

const Header = () => {
  return (
    <div className="h-[80px] flex items-center justify-center">
      <Link href="/login">Login</Link>
      <Link href="/register" className="mx-4">
        Register
      </Link>
      <Link href={"/profile"} className="mr-4">
        Profile
      </Link>
      <ModeToggle />
    </div>
  );
};

export default Header;
