/* eslint-disable react/prop-types */
import Spinner from "../ui/Spinner";
function MainButton({
  style = "",
  disabled = false,
  loading = false,
  children,
  ...props
}) {
  return (
    <button
      disabled={loading || disabled}
      className={`p-2  rounded-md flex  items-center justify-center duration-300  
           flex-1  bg-mainColor text-white hover:scale-105   ${style}`}
      {...props}
    >
      {loading ? (
        <Spinner size="24" colorClass="text-white" />
      ) : (
        <span className=" font-semibold">{children}</span>
      )}
    </button>
  );
}

export default MainButton;
