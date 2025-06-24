import api from "../utilities/api";
import { useEffect, useState } from "react";
export const handleDropdownFormat = (data, key, label, keys = []) => {
  if (!Array.isArray(data)) {
    console.log(data, key, label, keys, "cause error herre");
    return [];
  }

  return data?.map((item) => {
    let obj = {
      value: item[key],
      label: item[label],
    };

    keys.forEach((extraKey) => {
      obj[extraKey] = item[extraKey];
    });

    return obj;
  });
};
export function useDropDown(spName, params = {}, key, value) {
  //   const queryClient = useQueryClient(); // Access query cache
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `/list?sp=${spName}` +
          Object.keys(params)
            .map((paramKey) => `&${paramKey}=${params[paramKey]}`)
            .join("")
      );
      setData(handleDropdownFormat(response.data.data, key, value));
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(params)]);
  return {
    data: data,
    loading: isLoading,
    error: error,
  };
}
