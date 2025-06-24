/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useContext } from "react";
import Spinner from "../ui/Spinner";
import { motion } from "framer-motion";
import Image from "next/image";
// import { binarySearchForDropdown } from "../Grid/utilities/functions";
function DropDown({
  labelName,
  placeHolder,
  options = [],
  value = "",
  loading = false,
  onChange,
  isAtModal,
  intialOptionsToShow = 5,
  haveSearch = true,
  reset = false,
  notEditable = false,
  firstOption = true,
  span,
  disabledStyles,
  enabledStyles,
  returnObj,
  displayValue,
  paginationFunction,
  isString = false,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeOptionIndex, setActiveOptionIndex] = useState(-1);
  const [visibleCount, setVisibleCount] = useState(intialOptionsToShow);
  const [selectedValue, setSelectedValue] = useState(null);
  const [paginatedData, setPaginatedData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  //     binarySearchForDropdown(options, value)?.label || value?.label
  // options.find((option) => parseInt(option.value) === parseInt(value))
  // ?.label || null

  let baseClass =
    "w-full font-inter box-border p-3  center font-semibold text-base border border-none hover:outline-none bg-lightmainColor hover:outline-2 focus:border-inputFocuse rounded outline-none placeholder:font-light ";
  let disabledClass = `${disabledStyles ? disabledStyles : ""}`;
  let normalClass = `${enabledStyles ? enabledStyles : ""}`;
  let finalClass = baseClass;

  if (notEditable) {
    finalClass += disabledClass;
  } else {
    finalClass += normalClass;
  }

  const selectRef = useRef(null);
  const dropDownRef = useRef(null);
  const loadingRef = useRef(false);

  const isPaginated = typeof paginationFunction === "function";

  const fullOptions = isPaginated ? paginatedData : options;

  const filteredOptions = fullOptions.filter((option) => {
    let stringfiedLabel = option?.label || "";
    if (option && option.label && typeof option.label !== "string") {
      stringfiedLabel = stringfiedLabel.toString();
    }
    return stringfiedLabel?.toLowerCase().includes(inputValue.toLowerCase());
  });

  const visibleOptions = filteredOptions.slice(0, visibleCount);

  const handleSelectChange = (selectedOption) => {
    setSelectedValue(
      displayValue ? selectedOption.value : selectedOption.label
    );
    if (onChange) {
      if (returnObj) {
        onChange(selectedOption);
      } else {
        onChange(selectedOption?.value);
      }
    }
    setIsFocused(false);
    setActiveOptionIndex(-1);
  };

  const loadMoreOptions = async (currentSkip) => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;

    try {
      const newOptions = await paginationFunction(currentSkip);

      if (Array.isArray(newOptions) && newOptions.length > 0) {
        setPaginatedData((prev) => [...prev, ...newOptions]);
        setSkip((prev) => prev + newOptions.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Pagination error:", error);
    } finally {
      loadingRef.current = false;
    }
  };

  const handleInputFocus = () => setIsFocused(true);

  const handleInputBlur = (event) => {
    if (
      dropDownRef.current &&
      dropDownRef.current.contains(event.relatedTarget)
    ) {
      return;
    }
    setIsFocused(false);
    setActiveOptionIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (isFocused) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveOptionIndex((prevIndex) =>
          prevIndex + 1 >= filteredOptions.length ? 0 : prevIndex + 1
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveOptionIndex((prevIndex) =>
          prevIndex - 1 < 0 ? filteredOptions.length - 1 : prevIndex - 1
        );
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (
          activeOptionIndex >= 0 &&
          activeOptionIndex < filteredOptions.length
        ) {
          handleSelectChange(filteredOptions[activeOptionIndex]);
        }
      }
    }
  };

  const scrollToActiveOption = () => {
    if (!dropDownRef.current) {
      console.warn("Dropdown ref not available");
      return;
    }

    const activeOption = dropDownRef.current.querySelector(".active-option");
    if (!activeOption) {
      console.warn("Active option not found");
      return;
    }

    const dropdownTop = dropDownRef.current.scrollTop;
    const dropdownBottom = dropdownTop + dropDownRef.current.clientHeight;
    const optionTop = activeOption.offsetTop;
    const optionBottom = optionTop + activeOption.clientHeight;

    if (optionTop < dropdownTop) {
      dropDownRef.current.scrollTop = optionTop;
    } else if (optionBottom > dropdownBottom) {
      dropDownRef.current.scrollTop =
        optionBottom - dropDownRef.current.clientHeight;
    }
  };

  const handleScroll = () => {
    if (
      dropDownRef.current &&
      dropDownRef.current.scrollTop + dropDownRef.current.clientHeight >=
        dropDownRef.current.scrollHeight - 10
    ) {
      if (isPaginated) {
        loadMoreOptions(skip);
      } else {
        setVisibleCount((prev) =>
          Math.min(prev + intialOptionsToShow, filteredOptions.length)
        );
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      scrollToActiveOption();
    }
  }, [activeOptionIndex, isFocused]);

  useEffect(() => {
    const currentDropDown = dropDownRef.current;
    if (isFocused) {
      currentDropDown?.addEventListener("scroll", handleScroll);
      return () => currentDropDown?.removeEventListener("scroll", handleScroll);
    }
  }, [isFocused]);

  useEffect(() => {
    if (value == null && !firstOption) return;

    setVisibleCount(intialOptionsToShow);

    if (options.length > 0) {
      const selectedOption =
        firstOption && !value
          ? options[0]
          : options.find((option) => option?.value == value) || "";

      if (selectedOption && selectedOption.label !== selectedValue) {
        handleSelectChange(selectedOption);
      }
    }
  }, [options]);

  // console.log(options);
  // console.log(selectedValue);

  useEffect(() => {
    if (isPaginated && paginatedData.length === 0) {
      loadMoreOptions(0);
    }
  }, [isPaginated]);

  return (
    <div
      className={`flex flex-1 flex-col gap-2 ${
        loading && "justify-center items-center"
      } w-full `}
      /* CHANGED: Added responsive width classes (w-full for small, md:w-1/2 for medium+) */
    >
      {loading ? (
        <Spinner size="24"></Spinner>
      ) : (
        <>
          {labelName && (
            <label className="font-medium font-inter text-[16px]">{`${labelName} `}</label>
          )}
          <div className="relative">
            <input
              {...props}
              placeholder={
                placeHolder || placeHolder === "" ? `${placeHolder}` : ""
              }
              ref={selectRef}
              className={finalClass}
              value={isFocused ? inputValue : selectedValue || ""}
              onClick={
                notEditable
                  ? null
                  : isFocused
                  ? handleInputBlur
                  : handleInputFocus
              }
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              onChange={(e) => setInputValue(e.target.value)}
              readOnly={!haveSearch || (notEditable ? true : false)}
            />
            <div
              className={`absolute z-[100] bg-  right-1  top-1/2 transform -translate-y-1/2 transition-transform duration-300 ${
                isFocused && !notEditable && !reset ? "rotate-180" : "rotate-0"
              }`}
            >
              {reset && selectedValue ? (
                <Image
                  width={16}
                  height={16}
                  src={"/Icons/Cancel.svg"}
                  onClick={() => {
                    if (!notEditable) {
                      setSelectedValue("");
                      onChange("");
                    }
                  }}
                  className={`cursor-pointer hover:scale-125 duration-300`}
                />
              ) : (
                <Image
                  width={30}
                  height={30}
                  onClick={
                    notEditable
                      ? null
                      : isFocused
                      ? handleInputBlur
                      : handleInputFocus
                  }
                  src={"/icons/ArrowDownIcon.svg"}
                  alt="ArrowDownIcon"
                  className="w-[30px] h-[30px] cursor-text"
                />
              )}
            </div>

            {isFocused && !notEditable && (
              <motion.div
                initial={{ opacity: 0, maxHeight: 0 }}
                animate={{ opacity: 1, maxHeight: `10rem` }}
                exit={{ opacity: 1, maxHeight: 0 }}
                transition={{ duration: 0.3 }}
                ref={dropDownRef}
                className="absolute w-full my-1 bg-white border border-[#DCDCDC] rounded-md shadow-lg max-h-40 overflow-y-auto scroll-smooth"
                style={{ zIndex: 9999 }}
              >
                {visibleOptions.length > 0 ? (
                  visibleOptions.map((option, index) => {
                    const isActive = index === activeOptionIndex;
                    let text = displayValue ? option?.value : option.label;

                    if (text === 0) {
                      text = "0";
                    } else if (!text) {
                      text = "";
                    }
                    return (
                      <div
                        tabIndex={-1}
                        key={index}
                        className={` p-2 cursor-pointer hover:bg-gray-200 ${
                          option?.flag && "bg-red-400"
                        } ${isActive ? "bg-blue-100 active-option" : ""} ${
                          selectedValue === option?.label ? "bg-[#F6F6F6]" : ""
                        } flex justify-between items-center`}
                        onClick={() => handleSelectChange(option)}
                      >
                        {option?.img ? (
                          <Image
                            width={20}
                            height={20}
                            src={option?.img}
                            alt="Icon"
                            className={`w-[20px] h-[20px]`}
                          />
                        ) : null}

                        <p className="">{text}</p>
                        <Image
                          width={20}
                          height={20}
                          src={"/Icons/trueIcon.svg"}
                          alt="Icon"
                          className={`w-[20px] h-[20px] ${
                            selectedValue === option?.label ? "" : "hidden"
                          }`}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="p-2 text-gray-500">no options found</div>
                )}
              </motion.div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default DropDown;

// else if (isDep) {
//   setSelectedValue(
//     options?.find((option) => option?.value == initialValue)?.label ||
//       value?.label
//   );
// }
