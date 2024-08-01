import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const cookieStore = cookies();
    const sessionToken = cookieStore.get("token");
    if (!sessionToken) {
      return Response.json({ message: "No session token found" });
    }
    const userResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_USER}/get-user/${id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${sessionToken?.value}`,
        },
      }
    );
    const userDetails = await userResponse.json();
    if (userDetails.message === "")
      return Response.json({ message: "error detail user" }, { status: 200 });
    return Response.json(
      { data: userDetails?.data },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching user details:", error);
    Response.json({ message: "Not sessionToken" }, { status: 400 });
  }
}
