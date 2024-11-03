// "use client";

// import { SessionProvider } from "next-auth/react";

// const AuthProvider = ({ Children, session }) => {
//   return (
//     <div>
//       <SessionProvider>{Children}</SessionProvider>
//     </div>
//   );
// };

"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Session } from "next-auth";

interface AuthProviderProps {
  children: ReactNode;
  session: Session | null;
}

const AuthProvider = ({ children, session }: AuthProviderProps) => {
  return (
    <div>
      <SessionProvider session={session}>{children}</SessionProvider>
    </div>
  );
};

export default AuthProvider;