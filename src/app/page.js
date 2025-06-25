"use client";
import { use, useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/User";
import { useRouter } from "next/navigation";
import TextInput from "@/Components/input/TextInput";
import MainButton from "@/Components/input/MainButton";
import toast from "react-hot-toast";
import Link from "next/link";
export default function Home() {
  const { userAuthed, login } = useContext(UserContext);
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (userAuthed) {
      router.push("/dashboard/Pharmacy");
    }
  }, [userAuthed]);
  return (
    <div>
      <div className="grid font-lexend  items-center justify-items-center  p-8 pb-20 gap-16 sm:p-20">
        <h1 className="text-3xl m-auto   font-bold">Welcome back</h1>
        <form
          className="flex flex-col gap-4 m-auto w-full max-w-md"
          onSubmit={async () => await login(user)}
        >
          <TextInput
            inputName={"email"}
            placeholder={"Email"}
            value={user}
            onChange={setUser}
            type={"text"}
          ></TextInput>
          <TextInput
            inputName={"password"}
            placeholder={"Password"}
            value={user}
            onChange={setUser}
            type={"password"}
          ></TextInput>
          <MainButton
            loading={loading}
            style="w-[60%] m-auto font-inter "
            onClick={async (e) => {
              e.preventDefault();
              if (!user.email || !user.password) {
                toast("Please fill in all fields", { type: "error" });
                return;
              }
              try {
                setLoading(true);
                const message = await login({ ...user });
                console.log(message, "message");
                toast(message || "Login success ", { type: "success" });
              } catch (error) {
                console.log(error, "error");
                toast(error?.data?.message || "Login failed", {
                  type: "error",
                });
              } finally {
                setLoading(false);
              }
            }}
          >
            Login
          </MainButton>
          <Link href={"/forget-password"}>
            <p className="text-center font-poppins font-semibold   text-sm ">
              Forgot your password?{" "}
            </p>
          </Link>
          <Link href={"/register"}>
            <p className="text-center font-poppins font-semibold text-sm ">
              Don't have an account? Create account{" "}
            </p>
          </Link>
        </form>
      </div>
    </div>
  );
}
