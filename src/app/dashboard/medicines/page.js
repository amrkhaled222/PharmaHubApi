"use client";
import { useState, useEffect } from "react";
import Table from "@/Components/ui/Table";
import api from "@/utilities/api";
import { useUser } from "@/context/User";
import Spinner from "@/Components/ui/Spinner";
import { useCallback } from "react";
import ReactPaginate from "react-paginate";
import TextInput from "@/Components/input/TextInput";
export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const {
    user: { userPharmacy },
  } = useUser();
  const [loading, setLoading] = useState("init");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    Search: "",
  });
  // Debounce utility function

  // Debounce utility function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      getMedicines(1, searchTerm);
    }, 600), // 600ms delay
    []
  );

  const handleSearchChange = (searchTerm) => {
    setPagination((prev) => ({ ...prev, Search: searchTerm, currentPage: 1 }));
    debouncedSearch(searchTerm);
  };
  const getMedicines = async (page = 1, search = pagination.Search) => {
    setLoading(true);
    try {
      const med = await api.get(
        `pharmacy/drug/${userPharmacy[0].ID}?PageNumber=${page}&Search=${search}`
      );
      setMedicines(med.data.data);
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
        totalPages: med.data.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userPharmacy?.length > 0) {
      getMedicines();
    }
  }, [userPharmacy]);

  return (
    <>
      <div className="px-4">
        <TextInput
          value={pagination}
          inputName={"Search"}
          state={false}
          onChange={handleSearchChange}
          placeholder="Search by name or company"
        ></TextInput>
      </div>
      {loading ? (
        <div className="flex items-center  justify-center w-full h-full">
          <Spinner size="200"></Spinner>
        </div>
      ) : (
        <div className="w-full p-4 flex relative flex-col gap-4 overflow-auto">
          <Table data={medicines} setData={setMedicines} />
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            nextClassName="text-lightBlue whitespace-nowrap border-[0.5px] flex justify-center items-center w-full h-full hover:scale-95 cursor-pointer border-lightBlue rounded-md ease-in-out duration-300 transform"
            previousClassName="text-lightBlue whitespace-nowrap border-[0.5px] flex justify-center items-center w-full h-full hover:scale-95 cursor-pointer border-lightBlue rounded-md ease-in-out duration-300 transform"
            pageClassName="text-lightBlue border-[0.5px] flex justify-center items-center w-full h-full lg:flex hidden hover:scale-95 cursor-pointer border-lightBlue  rounded-md ease-in-out duration-300 transform"
            onPageChange={({ selected }) => {
              getMedicines(selected + 1);
            }}
            activeClassName="text-white bg-lightBlue border-[0.5px] border-lightBlue rounded-md ease-in-out duration-300 transform"
            pageRangeDisplayed={4}
            pageCount={pagination.totalPages}
            forcePage={pagination.currentPage - 1}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            pageLinkClassName="w-full h-full flex px-2 py-2 items-center justify-center"
            nextLinkClassName="w-full h-full flex px-2 py-2 items-center justify-center"
            previousLinkClassName="w-full h-full flex px-2 py-2 items-center justify-center"
            className="flex justify-center gap-2 md:gap-6 items-center w-full ease-in-out duration-300 transform"
            containerClassName="w-full"
          />
        </div>
      )}
    </>
  );
}
