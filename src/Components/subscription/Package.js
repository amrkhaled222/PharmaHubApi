"use client";
import Image from "next/image";
import MainButton from "../input/MainButton";

export default function Package({ packageData, onClick }) {
  return (
    <div
      onClick={() => onClick(packageData)}
      className="bg-black relative text-white  font-poppins min-h-[624px] p-8 rounded-[32px]  flex flex-col justify-between cursor-pointer hover:shadow-lg"
    >
      <div className="absolute -top-3 left-0 w-full h-full rounded-[32px] z-[-1]">
        {packageData?.IsMostPopular && (
          <div className="absolute -top-10 left-0 z-0 w-full rounded-4xl">
            <div className="bg-[#323232] pt-3 pb-12 px-4  text-white flex items-center justify-center   rounded-t-4xl text-2xl font-bold">
              Most Popular
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col z-10 relative">
        <h2 className="text-xl font-bold font-poppins mb-2">
          {packageData.PackageName}
        </h2>
        <p className=" mb-8">
          <span className="text-5xl font-bold">${packageData.Cost} </span>
          {packageData.DurationInMonth}/mo(s)
        </p>
        <div className="mt-4 flex-1">
          <ul className="space-y-4">
            {packageData.items.map((item, index) => (
              <li
                key={index}
                className="flex font-medium text-xl items-center gap-2"
              >
                <Image
                  src={"/icons/whiteTrueIcon.svg"}
                  width={24}
                  height={24}
                  alt="Check Icon"
                ></Image>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-full flex justify-center items-center mt-4">
        <MainButton style="!bg-[#323232] !font-white">Upgrade now</MainButton>
      </div>
    </div>
  );
}
