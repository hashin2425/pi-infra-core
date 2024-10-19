// https://localhost:3000/Login

import { LoginForm } from "../components/LoginComponent";

export default function Login() {
  return (
    <main className="p-4 h-96 max-h-screen flex justify-center content-center flex-wrap">
      <div className="rounded-lg shadow-2xl p-4">
        <LoginForm />
      </div>
    </main>
  );
};

