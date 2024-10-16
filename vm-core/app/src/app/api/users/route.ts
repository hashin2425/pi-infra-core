import { NextResponse } from "next/server";
import { createRedisConnection } from "@/libs/redis";
import { User } from "@/types";

export async function GET() {
  const client = await createRedisConnection();

  const keys = await client.keys("user:*");
  const users: User[] = [];

  for (const key of keys) {
    const user = await client.hGetAll(key);
    users.push({ id: key.split(":")[1], name: user.name });
  }

  await client.quit();

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const client = await createRedisConnection();

  const { name } = await request.json();
  const id = Date.now().toString();
  await client.hSet(`user:${id}`, { name });

  await client.quit();

  return NextResponse.json({ id, name }, { status: 201 });
}
