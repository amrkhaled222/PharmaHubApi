"use client";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import api from "@/utilities/api";
import { useUser } from "@/context/User";
import TextInput from "../input/TextInput";
import MainButton from "../input/MainButton";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// Load Stripe using your publishable test key
const stripePromise = loadStripe(
  "pk_test_51R5BgBRt4FEEONR254py0ErPfYj8rQ1QcVtsOVtr1dltVkybkcOXTsXW2fHl7jUq83BxXJkN79H8LHP6DMBg0rNO00mqp3RqA8"
);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    PackageID: searchParams.get("PackageID") || "",
    PharmacyID: "",
    StreetAddress: "",
    StreetAddress2: "",
    City: "",
    Region: "",
    PostalCode: "",
  });

  const router = useRouter();
  const {
    user: { userPharmacy },
  } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe has not yet loaded
    }

    const cardElement = elements.getElement(CardElement);
    setLoading(true);
    try {
      // Send request to create a payment intent
      const response = await api.post("payment/", {
        ...data,
        PharmacyID: userPharmacy[0].ID,
      });
      const { clientSecret } = response.data;

      // Confirm the payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      toast("Payment successful!");
      router.push("/dashboard/subscriptions");
    } catch (error) {
      toast(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className=" p-4 grid items-center  grid-cols-2 gap-6">
      <div className="flex flex-col gap-2 ">
        <label className="font-inter font-medium text-[16px] ">
          Card Details
        </label>
        <CardElement className="p-4 rounded h-fit bg-lightmainColor" />
      </div>
      <TextInput
        value={data}
        inputName={"StreetAddress"}
        label={"Street Address"}
        autoComplete="address-line1"
        onChange={setData}
      />
      <TextInput
        autoComplete="address-line2"
        value={data}
        inputName={"StreetAddress2"}
        label={"Street Address 2"}
        onChange={setData}
      />
      <TextInput
        value={data}
        inputName={"City"}
        label={"City"}
        onChange={setData}
      />
      <TextInput
        value={data}
        inputName={"Region"}
        label={"Region"}
        onChange={setData}
      />
      <TextInput
        value={data}
        inputName={"PostalCode"}
        onChange={setData}
        label={"Postal Code"}
      />
      <div className="self-end flex   justify-end items-end flex-col   col-end-3">
        <MainButton
          loading={loading}
          onClick={(e) => {
            e.preventDefault();
            if (
              !data.PackageID ||
              !data.StreetAddress ||
              !data.City ||
              !data.Region ||
              !data.PostalCode
            ) {
              toast("Please fill in all fields", { type: "error" });
              return;
            }
            handleSubmit(e);
          }}
        >
          Checkout
        </MainButton>
      </div>
    </form>
  );
}

export default function PaymentPage({ PackageID }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm PackageID={PackageID} />
    </Elements>
  );
}
