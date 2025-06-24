"use client";
import { useUser } from "@/context/User";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "../ui/Spinner";
import { usePathname } from "next/navigation";

import toast from "react-hot-toast";
const Li = ({ icon, href, children, active, onClick }) => {
  return (
    <div
      href={href}
      onClick={() => {
        onClick(href);
      }}
      className={`hover:bg-gray-100 duration-300 p-2 gap-2 hover:scale-95  font-lexend font-medium flex  rounded-md  cursor-pointer ${
        active ? "bg-lightmainColor" : ""
      }`}
    >
      <Image src={icon} alt={children} width={24} height={24}></Image>
      {children}
    </div>
  );
};
export const Aside = () => {
  const router = useRouter();
  const { logOut } = useUser();
  const [loader, setLoader] = useState("");
  const pathname = usePathname();
  const handleClick = (href) => {
    router.push(href);
  };
  console.log(router, "router.pathname");
  const links = [
    {
      icon: "/icons/Home.svg",
      href: "/dashboard/home",
      label: "Dashboard",
    },

    {
      icon: "/icons/Pharmacy.svg",
      href: "/dashboard/Pharmacy",
      label: "My Pharmacy",
    },
    {
      icon: "/icons/Medicine.svg",
      href: "/dashboard/medicines",
      label: "Medicines",
    },
    {
      icon: "/icons/Messages.svg",
      href: "/dashboard/messages",
      label: "Messages",
    },
    {
      icon: "/icons/Subscription.svg",
      href: "/dashboard/subscriptions",
      label: "Subscriptions",
    },
    {
      icon: "/icons/Settings.svg",
      href: "/dashboard/settings",
      label: "Settings",
    },
  ];
  return (
    <aside className="bg-[#F7FAFC] h-full flex-col flex justify-between   shadow-md p-4">
      <div className="flex flex-col gap-4">
        <div className="space-y-2 flex flex-col gap-2">
          {links.map((link, index) => (
            <Li
              onClick={handleClick}
              active={pathname == link.href}
              key={index}
              icon={link.icon}
              href={link.href}
            >
              {link.label}
            </Li>
          ))}
        </div>
      </div>
      <button
        onClick={async () => {
          try {
            setLoader("logout");
            await logOut();
            toast("Logged out successfully", {
              type: "success",
            });
            router.push("/");
          } catch (error) {
            console.error("Logout failed:", error);
            toast(error?.response?.data?.data?.message || "Failed to log out", {
              type: "error",
            });
          } finally {
            setLoader("");
          }
        }}
        className="flex items-center gap-2  font-poopins  font-semibold hover:scale-95 duration-300 p-2 rounded-md"
      >
        {loader === "logout" ? (
          <Spinner size="24" colorClass="text-gray-500" />
        ) : (
          <>
            <Image
              src="/icons/leftArrow.svg"
              alt="Logout"
              width={24}
              height={24}
            />
            Logout
          </>
        )}
      </button>
    </aside>
  );
};
