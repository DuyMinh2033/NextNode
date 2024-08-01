"use client";
import { useAppContext } from "@/app/appContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";

interface Idata {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  message?: string;
}

const LoginForm = () => {
  const router = useRouter();
  const [data, setData] = useState<Idata>({
    email: "",
    password: "",
  });
  const { setToken } = useAppContext();
  const [errors, setErrors] = useState<Errors>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async () => {
    const newErrors: Errors = {};
    if (!validateEmail(data.email)) {
      newErrors.email = "Invalid email format";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const fetchData = await fetch(
        `${process.env.NEXT_PUBLIC_API_USER}/login`,
        {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await fetchData.json();
      setToken(result?.token);
      if (result?.infoUser?.id) {
        // router.push("/");
        toast({
          variant: "destructive",
          title: "Login successfully",
        });
        console.log("message", result.message);
        if (result.message)
          setErrors((prev) => ({ ...prev, message: result.message }));
        await fetch("api/auth", {
          method: "post",
          body: JSON.stringify(result),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const getProfileUser = result?.infoUser?.id;
        if (getProfileUser) {
          const userDetails = await fetch(
            `/api/getUserDetail?id=${getProfileUser}`
          );
          const userDetailsJson = await userDetails.json();
        }
      }
    }
  };
  return (
    <div className="w-[350px] flex flex-col gap-10">
      <h1 className="text-center font-medium text-[27px]">Login</h1>
      <div className="flex items-center">
        <p className="w-[110px]">Email</p>
        <Input
          type="text"
          className="ring-2 ring-gray-500 ml-4"
          onChange={(e) =>
            setData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </div>
      <div className="flex items-center">
        <p className="w-[110px]">Password</p>
        <Input
          type="password"
          className="ring-2 ring-gray-500 ml-4"
          onChange={(e) =>
            setData((prev) => ({ ...prev, password: e.target.value }))
          }
        />
      </div>
      {errors.email && (
        <p className="text-red-500 text-sm text-center">{errors.email}</p>
      )}
      {errors.message !== "" && (
        <p className="text-red-500 text-sm text-center">{errors.message}</p>
      )}
      <Button
        className="w-1/2 rounded-full mx-auto"
        onClick={() => handleSubmit()}
      >
        Login
      </Button>
    </div>
  );
};
export default LoginForm;
