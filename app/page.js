"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent standard HTML page reload

    // Extract input values directly from the form element
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      let res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data = await res.json();

      if (res.ok) {
        alert("Login successful!");
        console.log(data);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" required />

        <label htmlFor="password">Password</label>
        <input type="password" name="password" required />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
