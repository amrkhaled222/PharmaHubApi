'use client";';
import Image from "next/image";
export default function Message({
  Message,
  SenderName,
  ReciverName,
  SenderImage,
  ReciverImage,
  isSender,
  TimeStamp,
}) {
  return (
    <div
      className={`flex items-start gap-2   ${
        isSender ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex  w-full   justify-start gap-2 items-end  ${
          isSender ? "flex-row-reverse" : ""
        }`}
      >
        {isSender ? (
          <Image
            src={SenderImage || "/icons/avatarDefault.svg"}
            alt={SenderName}
            width={40}
            height={40}
            className=" object-cover rounded-full"
          />
        ) : (
          <Image
            src={ReciverImage || "/icons/avatarDefault.svg"}
            alt={ReciverName}
            width={40}
            height={40}
            className="object-cover rounded-full"
          />
        )}
        <div className="flex w-[50%]  flex-col gap-1">
          <p
            className={`text-xs capitalize font-lexend   text-lightBlue ${
              isSender ? "text-right" : "text-left"
            }`}
          >
            {isSender ? SenderName : ReciverName}
          </p>
          <div
            className={` py-[12px] px-4 rounded-xl ${
              isSender ? "bg-mainColor" : "bg-[#F6F6F6]"
            }`}
          >
            <p className="font-poppins font-normal">{Message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
