"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserName, setNewUserName] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    const data = await response.json();
    setUsers(data);
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newUserName }),
    });
    const newUser = await response.json();
    setUsers([...users, newUser]);
    setNewUserName("");
  };

  return (
    <div>
      <ul className="mb-4">
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.name}
          </li>
        ))}
      </ul>
      <form onSubmit={addUser} className="flex gap-2">
        <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="Enter new user name" className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Add User
        </button>
      </form>
    </div>
  );
}
