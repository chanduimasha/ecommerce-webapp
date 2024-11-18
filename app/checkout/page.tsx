"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ShoppingBag, Truck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShippingDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const Page = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart items");
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0
    );
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const orderData = {
        items: cartItems,
        shippingDetails,
        paymentDetails,
        totalAmount: calculateTotal(),
      };

      const response = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to place order");

      // Clear cart after successful order
      await fetch("http://localhost:3001/api/cart/clear", {
        method: "DELETE",
      });

      setOrderPlaced(true);
      setCurrentStep(3);
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setPaymentDetails({ ...paymentDetails, cardNumber: value });
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setPaymentDetails({ ...paymentDetails, expiryDate: value });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Checkout Form */}
        <div className="flex-1">
          <div className="flex items-center mb-8">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? "bg-fuchsia-600" : "bg-gray-300"
              } text-white`}
            >
              1
            </div>
            <div className="h-1 w-16 mx-2 bg-gray-300">
              <div
                className={`h-full ${
                  currentStep >= 2 ? "bg-fuchsia-600" : "bg-gray-300"
                }`}
              ></div>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? "bg-fuchsia-600" : "bg-gray-300"
              } text-white`}
            >
              2
            </div>
            <div className="h-1 w-16 mx-2 bg-gray-300">
              <div
                className={`h-full ${
                  currentStep >= 3 ? "bg-fuchsia-600" : "bg-gray-300"
                }`}
              ></div>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? "bg-fuchsia-600" : "bg-gray-300"
              } text-white`}
            >
              3
            </div>
          </div>

          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping Information
                </CardTitle>
                <CardDescription>
                  Enter your shipping details below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1 text-white">
                      <Input
                        required
                        placeholder="Full Name"
                        value={shippingDetails.fullName}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            fullName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-span-1 text-white">
                      <Input
                        required
                        type="email"
                        placeholder="Email"
                        value={shippingDetails.email}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-span-1 text-white">
                      <Input
                        required
                        placeholder="Address"
                        value={shippingDetails.address}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="text-white">
                      <Input
                        required
                        placeholder="City"
                        value={shippingDetails.city}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="text-white">
                      <Input
                        required
                        placeholder="Postal Code"
                        value={shippingDetails.postalCode}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            postalCode: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-span-1 text-white">
                      <Input
                        required
                        placeholder="Country"
                        value={shippingDetails.country}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            country: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-fuchsia-600 text-white"
                  >
                    Continue to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
                <CardDescription>
                  Enter your payment details below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 text-white">
                      <Input
                        required
                        placeholder="Card Number"
                        value={paymentDetails.cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                      />
                    </div>
                    <div className="col-span-2 text-white">
                      <Input
                        required
                        placeholder="Card Holder Name"
                        value={paymentDetails.cardHolder}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            cardHolder: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="text-white">
                      <Input
                        required
                        placeholder="MM/YY"
                        value={paymentDetails.expiryDate}
                        onChange={handleExpiryDateChange}
                        maxLength={5}
                      />
                    </div>
                    <div className="text-white">
                      <Input
                        required
                        type="password"
                        placeholder="CVV"
                        maxLength={3}
                        value={paymentDetails.cvv}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            cvv: e.target.value.replace(/\D/g, "").slice(0, 3),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-fuchsia-600 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Check className="w-6 h-6" />
                  Order Confirmed!
                </CardTitle>
                <CardDescription>
                  Thank you for your purchase. Your order has been successfully
                  placed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-left">
                    <p>
                      We have sent a confirmation email to{" "}
                      <span className="font-medium">
                        {shippingDetails.email}
                      </span>
                    </p>
                  </div>
                  <div className="text-center">
                    <Button
                      onClick={() => router.push("/home")}
                      className="bg-fuchsia-600 text-white"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-medium">
                    <p>Subtotal</p>
                    <p>${calculateTotal().toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                    <p>Shipping</p>
                    <p>Free</p>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg mt-4">
                    <p>Total</p>
                    <p className="text-fuchsia-600">
                      ${calculateTotal().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
