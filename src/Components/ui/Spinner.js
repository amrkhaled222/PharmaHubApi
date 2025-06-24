import React from "react";

const Spinner = ({ size = "64", colorClass = "text-mainColor" }) => {
  return (
    <div
      className={` animate-spin rounded-full border-4 border-solid border-current border-r-transparent ${colorClass}`}
      role="status"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* <span className="sr-only block">...</span> */}
    </div>
  );
};

export default Spinner;
