"use client";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/User";
import { Aside } from "@/Components/layout/Aside";
import { usePathname, useRouter } from "next/navigation";
export default function Layout({ children }) {
  const { userAuthed, user } = useContext(UserContext);
  const userPharmacy = user?.userPharmacy;
  const router = useRouter();
  const pathname = usePathname();
  // If the user is not authenticated, redirect to the login page
  useEffect(() => {
    if (!userAuthed) {
      router.push("/");
    }
  }, [userAuthed]);

  return (
    userAuthed && (
      <div className="grid grid-cols-[250_1fr] h-full">
        <Aside></Aside>
        <div className="overflow-y-auto h-full">
          <h1 className="text-xl font-lexend font-bold px-4 py-2 items-center shadow-xs capitalize">
            {pathname
              ?.split("/dashboard/")
              ?.slice(1)
              ?.join("")
              ?.split("/")
              ?.join(" > ")}
          </h1>

          <>{children}</>
        </div>
      </div>
    )
  );
}
