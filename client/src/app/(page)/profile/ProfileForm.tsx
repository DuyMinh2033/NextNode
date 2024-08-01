/* eslint-disable @next/next/no-img-element */
"use client";
import { useAppContext } from "@/app/appContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import React, { useEffect, useState } from "react";

interface Idata {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}
const ProfileForm = () => {
  const [data, setData] = useState<Idata>({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { IdUser, token } = useAppContext();
  useEffect(() => {
    const getDetailUser = async () => {
      const userDetails = await fetch(`/api/getUserDetail?id=${IdUser}`);
      const userDetailsJson = await userDetails.json();
      if (userDetailsJson?.data) {
        setData({
          username: userDetailsJson?.data?.username,
          email: userDetailsJson?.data?.email,
          password: userDetailsJson?.data?.password,
          avatar: userDetailsJson?.data?.avatar || "",
        });
      }
    };
    getDetailUser();
  }, [IdUser]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setData((prevData) => ({
          ...prevData,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async () => {
    console.log("data", data);
    const fetchData = await fetch(
      `${process.env.NEXT_PUBLIC_API_USER}/update-user/${IdUser}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await fetchData.json();
    if (result.message === "update user successfully") {
      toast({
        variant: "destructive",
        title: "update user successfully",
      });
    }
  };
  return (
    <div className="w-[350px] flex flex-col gap-10">
      <h1 className="text-center font-medium text-[27px]">Profile</h1>
      <div className="flex items-center">
        <p className="w-[110px]">Username</p>
        <Input
          type="text"
          value={data.username}
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
          value={data.email}
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
      {/* <ImageUpload /> */}
      <div className="flex items-center">
        <Input type="file" onChange={handleImageChange} />
        {data?.avatar && (
          <img
            src={data?.avatar}
            alt="Preview"
            className="h-[80px] w-[80px] rounded-full object-cover ml-6"
          />
        )}
      </div>
      <Button
        className="w-1/2 rounded-full mx-auto"
        onClick={() => handleSubmit()}
      >
        Update
      </Button>
    </div>
  );
};

export default ProfileForm;
