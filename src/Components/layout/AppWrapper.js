"use client";
import { useUser } from "@/context/User";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import Header from "./Header";
import Spinner from "../ui/Spinner";
import { LoadScript } from "@react-google-maps/api";
import { UserProvider } from "@/context/User";
const Wrapper = ({ children }) => {
  const { userLoading } = useUser();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    // Run in the browser
    const updateHeight = () => setHeight(window?.innerHeight - 50 || 0);

    updateHeight(); // Set initial height
    window?.addEventListener("resize", updateHeight); // Update on resize
    // Cleanup on unmount
    return () => window?.removeEventListener("resize", updateHeight);
  }, []);
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <div className="grid  grid-rows-[50px_1fr] ">
        <Header></Header>
        <main className="container mx-auto h-full  " style={{ height: height }}>
          {userLoading ? (
            <div className="flex items-center justify-center h-full ">
              <Spinner size="200" colorClass="text-mainColor" />
            </div>
          ) : (
            <>{children}</>
          )}
          <Toaster position="top-center" />
        </main>
      </div>
    </LoadScript>
  );
};
export default function AppWrapper({ children }) {
  // Redirect to the dashboard if the user is authenticated
  // useEffect(() => {
  //   if (!userAuthed) {
  //     router.push("/");
  //   }
  // }, [userAuthed]);

  // Show a loading state while checking authentication

  return (
    <>
      <UserProvider>
        <Wrapper>{children}</Wrapper>
      </UserProvider>
    </>
  );
}
