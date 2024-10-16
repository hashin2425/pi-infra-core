import UserList from "./components/UserList";

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <UserList />
    </main>
  );
}
