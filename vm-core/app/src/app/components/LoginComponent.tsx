"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const callbackUrl = searchParams?.get("callbackUrl") || "/";

    try {
      const response = await signIn("credentials", {
        redirect: false,
        id,
        password,
        callbackUrl,
      });
      if (response?.error) {
        console.log(response.error);
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full max-w-96">
      <h1 className="text-2xl">管理画面へログインする</h1>
      <form onSubmit={onSubmit}>
        <table className="my-4">
          <tbody>
            <tr>
              <td className="pr-2">
                <label htmlFor="id">ID</label>
              </td>
              <td>
                <input className="rounded border-2 border-gray" required type="text" id="id" value={id} onChange={(event) => setId(event.target.value)} />
              </td>
            </tr>
            <tr>
              <td className="pr-2">
                <label htmlFor="password">パスワード</label>
              </td>
              <td>
                <input className="rounded border-2 border-gray" required type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" className="w-full rounded bg-blue-600 text-white p-2">
          ログイン
        </button>
      </form>
    </div>
  );
};
