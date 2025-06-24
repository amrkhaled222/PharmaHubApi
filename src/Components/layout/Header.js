import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white z-20  mx-auto p-2 container shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between gap-4">
          <Image
            src={"/icons/Logo.svg"}
            width={42}
            height={42}
            alt="Logo"
          ></Image>
          <div className="font-lexend font-bold">PharmaHub Admin</div>
        </div>
      </div>
    </header>
  );
}
