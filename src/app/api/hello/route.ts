;

export async function GET(request: Request) {
  const data = { msg: "Hello World" };

  return Response.json({ data });
}
