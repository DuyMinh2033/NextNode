"use client";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface Errors {
  email?: string;
}
interface IData {
  username: string;
  email: string;
  password: string;
}
const RegisterForm = () => {
  const router = useRouter();
  const [data, setData] = useState<IData>({
    username: "",
    email: "",
    password: "",
  });

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
      console.log("??", errors);
    } else {
      const fetchData = await fetch(
        `${process.env.NEXT_PUBLIC_API_USER}/register`,
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
      if (result.message !== "") {
        router.push("/login");
      }
    }
  };

  return (
    <div className="w-[350px] flex flex-col gap-10">
      <h1 className="text-center font-medium text-[27px]">Register</h1>
      <div className="flex flex-col gap-10">
        <div className="flex items-center">
          <p className="w-[110px]">Username</p>
          <Input
            type="text"
            className="ring-2 ring-gray-500 ml-4"
            onChange={(e) =>
              setData((prev) => ({ ...prev, username: e.target.value }))
            }
          />
        </div>
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
        <Button className="w-1/2 rounded-full mx-auto" onClick={handleSubmit}>
          Register
        </Button>
      </div>
    </div>
  );
};
export default RegisterForm;
