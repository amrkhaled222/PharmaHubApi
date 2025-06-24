import Image from "next/image";

export default function ChatItem({ chat, onClick }) {
  return (
    <div
      className="flex font-lexend items-center justify-between bg-[#F7FAFC] gap-4 p-2 px-4 cursor-pointer "
      onClick={() => onClick(chat)}
    >
      <div className="flex items-center gap-4">
        <div className=" rounded-full  ">
          {chat?.UserPhoto ? (
            <Image
              alt="Avatar"
              width={56}
              height={56}
              src={chat?.UserPhoto}
            ></Image>
          ) : (
            <Image
              src="/icons/avatarDefault.svg"
              alt="Default Avatar"
              width={56}
              height={56}
            />
          )}
        </div>

        <div className="flex flex-col">
          <span className="font-semibold">{chat?.ChatTitle}</span>
          <span className="text-sm text-lightBlue">{chat.Message}</span>
        </div>
      </div>
      <div>
        <span className="text-xs text-text">
          {new Date(chat?.LastMessageDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
