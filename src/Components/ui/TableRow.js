"use client";
import api from "@/utilities/api";
import { useState } from "react";
import Spinner from "./Spinner";
import { useUser } from "@/context/User";

export default function TableRow({
  DrugNameEN,
  ID,
  DosageName,
  Usage,
  Company,
  IsFounded,
  setIsFounded = () => {},
}) {
  const [loading, setLoading] = useState(false);
  const {
    user: { userPharmacy },
  } = useUser();
  const addDrugToPharmacy = async (v) => {
    setLoading(true);
    try {
      const response = await api.post(`/pharmacy/${userPharmacy[0].ID}/drug`, {
        DrugID: ID,
        isFounded: v,
      });
      setIsFounded(v);
    } catch (error) {
      console.error("Error adding drug:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <tr className="border-b font-inter font-medium  border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm ">{DrugNameEN}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-lightBlue">
        {DosageName}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-lightBlue">
        {Usage}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-lightBlue">
        {Company}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-lightBlue">
        {loading ? (
          <Spinner
            size="20"
            colorClass="!border-lightBlue !border-b-transparent "
          />
        ) : (
          <input
            type="checkbox"
            onChange={(e) => {
              addDrugToPharmacy(e.target.checked);
            }}
            value={IsFounded || false}
            checked={IsFounded || false}
            className="w-4 h-4 text-lightBlue   rounded focus:ring-lightBlue focus:ring-2"
          />
        )}
      </td>
    </tr>
  );
}
