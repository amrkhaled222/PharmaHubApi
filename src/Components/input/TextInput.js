export default function TextInput({
  placeholder,
  value,
  onChange,
  className,
  label,
  type,
  state = true,
  inputName,
  ...props
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={inputName}
          className=" font-inter font-medium text-[16px] "
        >
          {label}
        </label>
      )}
      <input
        type={type}
        onChange={(e) => {
          if (state) {
            onChange((prev) => ({
              ...prev,
              [inputName]: e.target.value,
            }));
          } else {
            onChange(e.target.value);
          }
        }}
        value={value[inputName] || ""}
        placeholder={placeholder}
        alt="Input field"
        className={`bg-lightmainColor leading-6 font-inter text-[16px] p-3  pl-4 rounded-md placeholder:text-lightBlue  text-lightBlue  focus:border-none focus:outline-0 placeholder:text-md ${className}`}
        {...props}
      ></input>
    </div>
  );
}
