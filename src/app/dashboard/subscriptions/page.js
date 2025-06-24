"use client";
import PaymentPage from "@/Components/subscription/CheckoutForm";
import { useEffect, useState } from "react";
import { useUser } from "@/context/User";
import { useRouter } from "next/navigation";
import api from "@/utilities/api";
import Spinner from "@/Components/ui/Spinner";

import StartupScreen from "@/Components/ui/StartupScreen";
import Image from "next/image";
import Package from "@/Components/subscription/Package";
export default function Subscription() {
  const [subscription, setSubscription] = useState({});
  const [packages, setPackages] = useState({});
  const [loaders, setLoaders] = useState({
    subscription: true,
    packages: true,
  });
  const {
    user: { userPharmacy },
  } = useUser();
  const getPharmacySubscription = async () => {
    if (userPharmacy?.length === 0) {
      return;
    }
    setLoaders((prev) => ({ ...prev, subscription: true }));
    try {
      const response = await api.get(`/subscription/${userPharmacy[0].ID}`);
      setSubscription(response?.data?.data[0]);
      console.log(response.data.data[0], " subscription data");
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoaders((prev) => ({ ...prev, subscription: false }));
    }
  };
  const getPackages = async () => {
    if (userPharmacy?.length === 0) {
      return;
    }
    setLoaders((prev) => ({ ...prev, packages: true }));

    try {
      const response = await api.get("/subscription/packages");
      setPackages(response?.data?.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoaders((prev) => ({ ...prev, packages: false }));
    }
  };
  useEffect(() => {
    getPharmacySubscription();
    getPackages();
  }, []);

  return (
    <>
      {userPharmacy?.length == 0 ? (
        <div className="flex font-lexend  items-center flex-col w-full h-screen justify-center gap-8">
          <StartupScreen></StartupScreen>
        </div>
      ) : (
        <div className="w-full p-4 flex flex-col gap-4 ">
          <div className="w-full">
            {loaders.subscription ? (
              <div className="flex justify-center items-center h-full">
                <Spinner size="200" />
              </div>
            ) : Object.keys(subscription)?.length ? (
              <div className=" flex flex-col gap-2 ">
                <h2 className=" font-lexend p-4 font-bold text-xl">
                  Current Plan
                </h2>
                <div className="px-4 capitalize">
                  <p className="font-lexend font-bold text-lg">
                    {subscription?.PackageName}
                  </p>

                  <div className="grid  grid-cols-2 ">
                    <div className="flex flex-col jsustify-start h-full items-start">
                      <p className="text-lightBlue text-sm ">
                        {subscription?.Expired ? "Expired" : "Active"}
                      </p>
                    </div>
                    <Image
                      src={"/icons/treeImage.svg"}
                      width={200}
                      height={200}
                      priority
                      className="justify-self-end"
                      alt="Tree Image"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p>No active subscription found.</p>
            )}
          </div>

          <div className="p-4 flex flex-col">
            <h2 className="text-xl font-bold font-lexend mb-4 capitalize">
              select plan
            </h2>
            <div>
              {loaders.packages ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner size="200" />
                </div>
              ) : Object.keys(packages).length > 0 ? (
                <div className="grid  grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-[40.5PX] mt-[60px]">
                  {Object.keys(packages).map((pkg) => (
                    <Package packageData={packages?.[pkg]}></Package>
                  ))}
                </div>
              ) : (
                <p>No packages available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
