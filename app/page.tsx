import Image from "next/image";
import "./globals.css";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import BackgroundImage from "@/components/BackgroundImage";

export default function Home() {
  return (
    // <div>
    //   <h1>Login</h1>
    //   <h2>Login with Google</h2>
    //   <div>
    //     <button className="flex items-center gap-2">
    //       <FcGoogle />
    //       Login
    //     </button>
    //   </div>
    // </div>
    <main>
      <BackgroundImage />
    </main>
  );
}
