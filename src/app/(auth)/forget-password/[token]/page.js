"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TextInput from "@/Components/input/TextInput";
import Link from "next/link";
import MainButton from "@/Components/input/MainButton";
import api from "@/utilities/api";
import toast from "react-hot-toast";
export default function ResetPassword({ params }) {
  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  //   const params = router.query;

  console.log(params.token);
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password.newPassword || !password.confirmPassword) {
      toast("Please fill in all fields", { type: "error" });
      return;
    }
    if (password.newPassword !== password.confirmPassword) {
      toast("Passwords do not match", { type: "error" });
      return;
    }
    try {
      setLoading(true);
      const response = await api.post(`auth/reset-password`, {
        newPassword: password.newPassword,
        token: params.token,
      });
      toast(response.data.message || "Password reset successfully", {
        type: "success",
      });
      setTimeout(() => {
        router.push("/"); // Redirect to login page after 500ms
      }, 500);
    } catch (error) {
      console.error(error);
      toast(
        error?.response?.data?.data?.message || "Failed to reset password",
        {
          type: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col font-lexend items-center justify-items-center mt-7 gap-4">
      <h1 className="text-3xl font-bold">Reset Password</h1>
      <form
        className="flex flex-col gap-4 mt-4 m-auto w-full max-w-md"
        onSubmit={handleResetPassword}
      >
        <TextInput
          inputName="newPassword"
          placeholder="New Password"
          value={password}
          onChange={setPassword}
          type="password"
        />
        <TextInput
          inputName="confirmPassword"
          placeholder="Confirm Password"
          value={password}
          onChange={setPassword}
          type="password"
        />
        <MainButton
          style="w-[60%] m-auto font-inter"
          loading={loading}
          type="submit"
        >
          Reset Password
        </MainButton>
      </form>

      <Link href={"/"}>
        <p className="text-center font-poppins font-semibold text-sm ">
          Remembered your password?{" "}
        </p>
      </Link>
    </div>
  );
}
