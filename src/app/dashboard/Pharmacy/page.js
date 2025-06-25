"use client";
import StartupScreen from "@/Components/ui/StartupScreen";
import { useUser } from "@/context/User";
import Image from "next/image";
import { GoogleMap, Marker } from "@react-google-maps/api";
import MainButton from "@/Components/input/MainButton";
import { useRouter } from "next/navigation";
export default function Pharmacy() {
  const {
    user: { userPharmacy },
  } = useUser();

  const containerStyle = {
    width: "100%",
    minHeight: "300px",
  };

  const router = useRouter();

  return (
    <>
      {userPharmacy?.length == 0 ? (
        <StartupScreen></StartupScreen>
      ) : (
        <div className="px-6 space-y-4 mt-6">
          <div className="  w-full p-4 rounded-md   justify-center items-center shadow-sm  flex flex-col gap-4">
            <div className="flex w-full items-center justify-between">
              <h2 className="text-xl text-left font-lexend font-bold  capitalize">
                {userPharmacy?.[0].PharmacyName}
              </h2>
              <Image
                src={userPharmacy?.[0].Logo}
                width={64}
                height={64}
                alt="pharmacy logo"
              ></Image>
            </div>
            <div className="flex w-full flex-col  : font-poppins font-medium  items-start   justify-start  gap-4">
              <p className="">
                Address:{" "}
                <span className="font-normal">{userPharmacy?.[0].Address}</span>{" "}
              </p>
              <p className="">
                Phone:{" "}
                <span className="font-normal">{userPharmacy?.[0].Phone}</span>{" "}
              </p>
              <p className="">
                Description:{" "}
                <span className="font-normal">
                  {userPharmacy?.[0].Description}
                </span>
              </p>
            </div>
          </div>
          <div className="min-h-[200px]">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{
                lat: userPharmacy?.[0]?.Location?.points[0]?.lat,
                lng: userPharmacy?.[0]?.Location?.points[0]?.lng,
              }}
              zoom={15}
            >
              <Marker
                position={{
                  lat: userPharmacy?.[0]?.Location?.points[0]?.lat,
                  lng: userPharmacy?.[0]?.Location?.points[0]?.lng,
                }}
              />
            </GoogleMap>
          </div>
          <div className="grid items-end justify-end">
            <MainButton
              onClick={() => {
                router.push("/dashboard/Pharmacy/edit");
              }}
            >
              Edit Data
            </MainButton>
          </div>
        </div>
      )}
    </>
  );
}
