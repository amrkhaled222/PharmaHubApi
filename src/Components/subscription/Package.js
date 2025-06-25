"use client";
import Image from "next/image";
import MainButton from "../input/MainButton";

export default function Package({ packageData, onClick }) {
  return (
    <div className="relative isolate z-50 ">
      {!packageData?.IsMostPopular || (
        <div className="absolute  overflow-hidden -top-12 left-0 right-0 z-0   ">
          {" "}
          {/* Using negative margin */}
          <div className=" pt-3 bg-mainColor -z-10000    pb-12 px-4 text-white flex items-center justify-center rounded-t-4xl text-2xl font-bold">
            Most Popular
          </div>
        </div>
      )}

      <div
        onClick={() => onClick(packageData)}
        className=" relative z-50   bg-[#97cbc2]  overflow-hidden    text-white  font-poppins min-h-[204px] p-8 rounded-[32px]  flex flex-col justify-between cursor-pointer hover:shadow-lg"
      >
        <div className="flex flex-col z-10000000 relative">
          <h2 className="text-xl font-bold font-poppins mb-2">
            {packageData.PackageName}
          </h2>
          <p className=" mb-8">
            <span className="text-5xl font-bold">${packageData.Cost} </span>
            {packageData.DurationInMonth}/mo(s)
          </p>
          <div className="mt-4 flex-1">
            <ul className="space-y-4 ">
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
          <MainButton onClick={onClick}>Buy Now</MainButton>
        </div>
      </div>
    </div>
  );
}
