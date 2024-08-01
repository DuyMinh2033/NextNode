export async function POST(request: Request) {
  const res = await request.json();
  const sessionToken = res?.token;
  const userId = res?.infoUser?.id;
  if (!sessionToken)
    return Response.json({ message: "Not sessionToken" }, { status: 400 });
  return Response.json(
    { res: res },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": [
          `token=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict`,
          `IdUser=${userId}; Path=/; HttpOnly; Secure; SameSite=Strict`,
        ].join(", "),
      },
    }
  );
}
