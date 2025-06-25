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
  const router = useRouter();
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
        <StartupScreen></StartupScreen>
      ) : (
        <div className="w-full p-4 flex relative flex-col gap-4 ">
          <div className="w-full">
            {loaders.subscription ? (
              <div className="flex justify-center items-center h-full">
                <Spinner size="200" />
              </div>
            ) : Object.keys(subscription || {})?.length ? (
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
              <div className="flex flex-col items-center justify-center w-full p-6 bg-[#e1f3f050] border border-lightmainColor rounded-lg shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-10 h-10 text-mainColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.918-.816 1.995-1.85l.007-.15V6.2c0-1.054-.816-1.918-1.85-1.995L18.856 4H6.144c-1.054 0-1.918.816-1.995 1.85L4.144 6v12.2c0 1.054.816 1.918 1.85 1.995L6.144 20z"
                  />
                </svg>
                <h2 className="mt-4 text-lg font-semibold text-mainColor">
                  Your Subscription is Inactive
                </h2>
                <p className="mt-2 text-sm text-mainColor text-center">
                  Currently, your pharmacy is not visible to users because your
                  subscription is inactive. Consider activating a subscription
                  to ensure your pharmacy is displayed.
                </p>
              </div>
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
              ) : Object?.keys(packages || {})?.length > 0 ? (
                <div className="grid  isolate grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-[40.5PX] mt-[60px]">
                  {Object.keys(packages || {}).map((pkg, i) => (
                    <Package
                      key={pkg}
                      packageData={packages?.[pkg]}
                      onClick={(pkgID) => {
                        router.push(
                          "subscriptions/Checkout" + `?PackageID=${pkgID.ID}`
                        );
                      }}
                    ></Package>
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
