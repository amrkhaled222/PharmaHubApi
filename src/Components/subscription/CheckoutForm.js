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

// Load Stripe using your publishable test key
const stripePromise = loadStripe(
  "pk_test_51R5BgBRt4FEEONR254py0ErPfYj8rQ1QcVtsOVtr1dltVkybkcOXTsXW2fHl7jUq83BxXJkN79H8LHP6DMBg0rNO00mqp3RqA8"
);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentStatus, setPaymentStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe has not yet loaded
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Send request to create a payment intent
      const response = await api.post("payment/", {
        amount: 5000,
        username: "amr10",
        PackageID: "1",
        PharmacyID: 1,
      });

      const { clientSecret } = response.data;

      // Confirm the payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setPaymentStatus(`Payment failed: ${result.error.message}`);
      } else if (
        result.paymentIntent &&
        result.paymentIntent.status === "succeeded"
      ) {
        setPaymentStatus("Payment successful!");
      }
    } catch (error) {
      setPaymentStatus(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold mb-4">Test Payment</h1>
      <CardElement className="p-4 border rounded" />
      <button
        type="submit"
        disabled={!stripe}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Pay $50
      </button>
      {paymentStatus && <p className="mt-4">{paymentStatus}</p>}
    </form>
  );
}

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
