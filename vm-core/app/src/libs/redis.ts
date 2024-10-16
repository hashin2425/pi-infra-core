import { createClient as createRedisClient } from "redis";

export async function createRedisConnection() {
  const client = createRedisClient({
    url: "redis://redis:6379",
  });
  await client.connect();
  return client;
}
