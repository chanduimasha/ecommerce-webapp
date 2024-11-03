"use client";

import React, { useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const page = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/signup", { firstName, lastName, email, password })
      .then((result) => {
        if (result.status === 201) {
          router.push("/login");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          window.alert("Email already exists. Please use a different email.");
        } else {
          console.log(err);
        }
      });
  };

  // async function submit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();

  //   try {
  //     await axios.post("http://localhost:8000/signup", { email, password });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 0.4, duration: 0.4, ease: "easeIn" },
      }}
      className="text-white py-6 "
    >
      <div className="container mx-auto">
        <div className="xl:w-[100%]">
          <form
            onSubmit={handleSignup}
            action="POST"
            className="flex flex-col gap-6 p-10 bg-[#27272c] rounded-xl justify-center items-center"
          >
            <h3 className="text-4xl text-fuchsia-500">Signup</h3>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <Input
                className="w-80 xl:w-[600px] border border-gray-300 rounded p-1"
                type="text"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                placeholder="First Name"
                name="firstName"
                id=""
              />
              <Input
                className="w-80 xl:w-[600px] border border-gray-300 rounded p-1"
                type="text"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                placeholder="Last Name"
                name="lastName"
                id=""
              />
              <Input
                className="w-80 xl:w-[600px] border border-gray-300 rounded p-1"
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Email"
                name="email"
                id=""
              />
              <Input
                className="w-80 xl:w-[600px] border border-gray-300 rounded p-1"
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Password"
                name="password"
                id=""
              />
            </div>
            <Button size="md" className="max-w-40">
              Signup
            </Button>
          </form>

          {/* <br />
          <p>OR</p>

          <Link href="/signup">Signup Page</Link>

          <h2>Login with Google</h2>
          <div>
            <button className="flex items-center gap-2">
              <FcGoogle />
              Login
            </button>
          </div> */}
        </div>
      </div>
    </motion.section>
  );
};

export default page;
