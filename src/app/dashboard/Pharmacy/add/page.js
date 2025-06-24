"use client";
import DragAndDropUploader from "@/Components/input/FileUploader";
import MainButton from "@/Components/input/MainButton";
import MapWithDraggableMarker from "@/Components/input/MapWithDraggableMarker";
import TextInput from "@/Components/input/TextInput";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/utilities/api";
import { useUser } from "@/context/User";
import { useRouter } from "next/navigation";
export default function AddPharmacy() {
  const [pharmcyData, setPharmacyData] = useState({
    PharmacyName: "",
    Phone: "",
    Address: "",
    Longitude: "",
    Latitude: "",
    Description: "",
    Logo: "",
  });
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleCreatePharmacy = async (e) => {
    e.preventDefault();
    if (
      !pharmcyData.PharmacyName ||
      !pharmcyData.Phone ||
      !pharmcyData.Address ||
      !pharmcyData.Logo ||
      !pharmcyData.Longitude ||
      !pharmcyData.Latitude
    ) {
      toast("Please fill in all fields", { type: "error" });
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(pharmcyData).forEach((key) => {
        if (pharmcyData[key]) {
          formData.append(key, pharmcyData[key]);
        }
      });

      // Call your API to create the pharmacy
      const response = await api.post("pharmacy", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser((prev) => ({ ...prev, userPharmacy: response.data.data }));

      // Show success message
      toast(response.data.message || "Pharmacy created successfully", {
        type: "success",
      });
      router.push("/dashboard/home");
    } catch (error) {
      console.error(error);
      toast(error?.response?.data?.message || "Failed to create pharmacy", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center flex-col  p-4 justify-center h-full">
      <form className="grid lg:grid-cols-4 p-4 grid-cols-1  gap-x-6 gap-y-6 mt-4 m-auto w-full ">
        <TextInput
          value={pharmcyData}
          inputName={"PharmacyName"}
          onChange={setPharmacyData}
          placeholder={"Pharmacy Name"}
          type={"text"}
          label={"Pharmacy Name"}
        />
        <TextInput
          value={pharmcyData}
          inputName={"Phone"}
          onChange={setPharmacyData}
          placeholder={"Phone Number"}
          type={"number"}
          label={"Phone Number"}
        />
        <TextInput
          value={pharmcyData}
          inputName={"Address"}
          onChange={setPharmacyData}
          placeholder={"Address"}
          type={"text"}
          label={"Address"}
        />
        <TextInput
          value={pharmcyData}
          inputName={"Description"}
          onChange={setPharmacyData}
          placeholder={"Description"}
          type={"text"}
          label={"Description"}
        />
        <div className="lg:row-span-6   col-span-2 ">
          <DragAndDropUploader
            inputName={"Logo"}
            value={pharmcyData.Logo}
            onChange={setPharmacyData}
          ></DragAndDropUploader>
        </div>
        <div className="lg:row-span-6 lg:col-span-2  col-span-2">
          <MapWithDraggableMarker
            onChange={setPharmacyData}
          ></MapWithDraggableMarker>
        </div>
        <div className=" justify-self-end lg:col-end-5 col-end-3  ">
          <MainButton onClick={handleCreatePharmacy} loading={loading}>
            {" "}
            Create Pharmacy
          </MainButton>
        </div>
      </form>
    </div>
  );
}
