"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MainButton from "@/Components/input/MainButton";
export default function StartupScreen() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center  w-full justify-center gap-4">
      <Image
        src="/icons/Logo.svg"
        alt="Empty Pharmacy"
        width={100}
        height={100}
      />
      <h1 className="text-3xl   font-bold">
        Welcome to <span className="text-mainColor">PharmaHub</span>
      </h1>
      <p className="text-lg  font-lexend text-center max-w-xl">
        Every journey starts with a step. Begin yours by adding your first
        pharmacy to unlock the full power of your medicine network.
      </p>
      <div className=" ">
        <MainButton
          style="m-auto font-inter"
          onClick={() => {
            router.push("/dashboard/Pharmacy/add");
          }}
        >
          let's get started
        </MainButton>
      </div>
    </div>
  );
}
