"use client";
import MainButton from "@/Components/input/MainButton";
import TextInput from "@/Components/input/TextInput";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDropDown } from "@/hooks/useDropDown";
import DropDown from "@/Components/input/DropDown";
import Link from "next/link";
import OTPInput from "react-otp-input";
import api from "@/utilities/api";
import { useUser } from "@/context/User";
export default function register() {
  const [loading, setLoading] = useState(false);
  const [screenState, setScreenState] = useState("form");
  const { SignUp } = useUser();
  const [user, setUser] = useState({
    Email: "amrk4148@gmail.com",
    Username: "amrkhaled",
    password: "Amr@2020",
    LangID: 2,
    userTypeID: 2,
    BirthDate: "2003-03-07",
    gender: null,
    Otp: "",
  });
  const { data: genderList, loading: genderLoader } = useDropDown(
    "gender_list",
    {},
    "value",
    "label"
  );
  const chechUserValid = async (e) => {
    e.preventDefault();
    if (
      !user.Email ||
      !user.Username ||
      !user.password ||
      !user.BirthDate ||
      !user
    ) {
      toast("Please fill in all fields", { type: "error" });
      return;
    }
    try {
      setLoading("vlidateUser");
      const message = await api.post("auth/checkUser", user);
      toast("otp has been sent successfully", { type: "success" });
      setScreenState("otp");
    } catch (error) {
      console.log(error, "error");
      toast(error?.response?.data?.data?.message || "Register failed", {
        type: "error",
      });
    } finally {
      setLoading("");
    }
  };
  const verifyOTP = async (e) => {
    e.preventDefault();
    console.log(user.Otp);
    if (!user.Otp || user.Otp?.length < 5) {
      toast("Please enter the OTP", { type: "error" });
    }
    try {
      setLoading("verifyOTP");
      const response = await SignUp(user);
      toast("Registration successful", { type: "success" });
    } catch (error) {
      console.log(error, "error");
      toast(error?.response?.data?.data?.message || "Otp Vlidation Failed", {
        type: "error",
      });
    } finally {
      setLoading("");
    }
  };
  return (
    <div className="flex items-center justify-center ">
      <div className="bg-white  rounded-lg  w-full max-w-md">
        <h2 className="text-2xl font-lexend font-bold text-center mb-4">
          Register as Aministrator
        </h2>

        {screenState === "otp" ? (
          <div className="flex flex-col justify-center items-center gap-4">
            <p className="text-center font-poppins font-semibold text-sm">
              Please enter the OTP sent to your email
            </p>
            <OTPInput
              value={user.Otp || ""}
              onChange={(Otp) => {
                setUser((prev) => ({ ...prev, Otp }));
              }}
              numInputs={5}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: "40px",
                height: "40px",
                margin: "0 5px",
                fontSize: "20px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              isInputNum={true}
              shouldAutoFocus={true}
            />
            <MainButton
              loading={loading == "verifyOTP"}
              style="w-[60%] m-auto font-inter "
              onClick={verifyOTP}
            >
              Verify OTP
            </MainButton>
          </div>
        ) : (
          <form className="flex flex-col gap-4 ">
            <TextInput
              label={"Email"}
              inputName={"Email"}
              placeholder={"Email"}
              value={user}
              autoComplete="email"
              onChange={setUser}
              type={"text"}
            ></TextInput>
            <TextInput
              label={"Username"}
              autoComplete="username"
              inputName={"Username"}
              placeholder={"Username"}
              value={user}
              onChange={setUser}
              type={"text"}
            ></TextInput>
            <TextInput
              label={"Password"}
              inputName={"password"}
              placeholder={"Password"}
              value={user}
              onChange={setUser}
              type={"password"}
              autoComplete="current-password"
            ></TextInput>

            <TextInput
              label={"Birth Date"}
              inputName={"BirthDate"}
              value={user}
              onChange={setUser}
              type={"date"}
              format="YYYY-MM-DD"
            ></TextInput>
            <div className="flex justify-center items-center gap-2">
              <DropDown
                value={user.gender}
                labelName={"Gender"}
                loading={genderLoader}
                options={genderList}
                onChange={(v) => {
                  setUser((prev) => {
                    return { ...prev, gender: v };
                  });
                }}
              ></DropDown>
            </div>
            <MainButton
              loading={loading == "vlidateUser"}
              style="w-[60%] m-auto font-inter "
              onClick={chechUserValid}
            >
              Register
            </MainButton>
            <Link href={"/"}>
              <p className="text-center font-poppins font-semibold   text-sm ">
                Already have an account? Sign in{" "}
              </p>
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
