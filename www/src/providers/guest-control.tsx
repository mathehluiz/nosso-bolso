"use client";

import { Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";

export default function GuestControl({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader2Icon className="w-10 h-10 animate-spin " />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <>{children}</>;
  }

  return <>{children}</>;
}
