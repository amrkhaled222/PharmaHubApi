"use client";
import MainButton from "@/Components/input/MainButton";
import TextInput from "@/Components/input/TextInput";
import Link from "next/link";
import { useState } from "react";
import api from "@/utilities/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function ForgetPassword() {
  const [user, setUser] = useState({ Email: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!user.Email) {
      toast("Please enter your email address", { type: "error" });
      return;
    }
    try {
      setLoading(true);
      // Call your API to send the password reset link
      const response = await api.post("auth/forgot-password", {
        Email: user.Email,
      });
      toast(response.data.message || "Password reset link sent successfully", {
        type: "success",
      });
      setTimeout(() => {
        router.push("/"); // Redirect to login page after 500ms
      }, 500);
    } catch (error) {
      console.error(error);
      toast(
        error?.response?.data?.message || "Failed to send password reset link",
        { type: "error" }
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col font-lexend items-center justify-items-center  mt-7 gap-4 ">
      <h1 className="text-3xl font-bold">Forget Password</h1>
      <p className="text-lg">
        Please enter your email address to reset your password.
      </p>
      <form className="flex flex-col gap-4 mt-4 m-auto w-full max-w-md">
        <TextInput
          inputName={"Email"}
          placeholder={"Email"}
          value={user}
          onChange={setUser}
          type={"email"}
          autoComplete="email"
        />
        <MainButton
          style="w-[60%] m-auto font-inter"
          loading={loading}
          onClick={handlePasswordReset}
        >
          Send Reset Link
        </MainButton>
      </form>
      <Link href={"/"}>
        <p className="text-center font-poppins font-semibold   text-sm ">
          Back to Login?
        </p>
      </Link>
      <Link href={"/register"}>
        <p className="text-center font-poppins font-semibold text-sm ">
          Don't have an account? Create account{" "}
        </p>
      </Link>
    </div>
  );
}
