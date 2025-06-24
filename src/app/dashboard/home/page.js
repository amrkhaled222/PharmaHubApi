"use client";

import MainButton from "@/Components/input/MainButton";
import StartupScreen from "@/Components/ui/StartupScreen";
import { useUser } from "@/context/User";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Dashboard() {
  const {
    user: { userPharmacy },
  } = useUser();
  const router = useRouter();
  return (
    <div className="flex  font-lexend  mt-4 justify-center  items-center flex-col gap-8">
      {userPharmacy?.length == 0 ? (
        <>
          <StartupScreen />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
