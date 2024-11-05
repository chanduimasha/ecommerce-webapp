"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/login", { email, password })
      .then((result) => {
        if (result.data === "Success") {
          router.push("/home");
        } else {
          alert("Login failed: User does not exists");
        }
      })
      .catch((err) => console.log(err));
  };

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
            onSubmit={handleLogin}
            action="POST"
            className="flex flex-col gap-6 p-10 bg-[#27272c] rounded-xl justify-center items-center"
          >
            <h3 className="text-4xl text-fuchsia-500">Login</h3>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <Input
                className="w-80 xl:w-[600px] border border-gray-300 rounded p-1"
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Email"
                name="email"
                id="email"
              />
              <Input
                className="w-80 xl:w-[600px] border border-gray-300 rounded p-1"
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Password"
                name="password"
                id="password"
              />
            </div>
            <Button size="md" className="max-w-40">
              Login
            </Button>
          </form>
        </div>
      </div>
    </motion.section>
  );
};

export default Page;
